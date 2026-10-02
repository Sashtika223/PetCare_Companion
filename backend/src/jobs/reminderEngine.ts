import cron from 'node-cron';
import prisma from '../utils/prisma.js';
import { calculateVaccinationStatus } from '../utils/vaccinationHelper.js';

export const runReminderEngine = async (): Promise<void> => {
  console.log('⏰ Running Automated Reminder Engine Scan...');
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Scan Vaccinations
    const vaccinations = await prisma.vaccination.findMany({
      where: {
        nextDueDate: { not: null },
      },
      include: {
        pet: true,
      },
    });

    for (const vac of vaccinations) {
      if (!vac.nextDueDate) continue;

      const calculatedStatus = calculateVaccinationStatus(vac.nextDueDate);
      const dueDate = new Date(vac.nextDueDate);
      dueDate.setHours(0, 0, 0, 0);

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Trigger reminder for 30d, 7d, 1d, 0d or Overdue
      if (diffDays <= 30) {
        const notifTitle = `Vaccination ${calculatedStatus}: ${vac.vaccineName}`;

        const existing = await prisma.notification.findFirst({
          where: {
            userId: vac.pet.ownerId,
            petId: vac.petId,
            title: notifTitle,
          },
        });

        if (!existing) {
          await prisma.notification.create({
            data: {
              userId: vac.pet.ownerId,
              petId: vac.petId,
              type: 'Vaccination',
              title: notifTitle,
              message: `${vac.pet.name} is ${calculatedStatus.toLowerCase()} for ${vac.vaccineName} (Due: ${dueDate.toISOString().split('T')[0]}).`,
              scheduledAt: new Date(),
            },
          });
          console.log(`🔔 Generated notification for ${vac.pet.name} (${vac.vaccineName})`);
        }
      }
    }

    // 2. Scan Upcoming Vet Appointments (in 3 days or 1 day)
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        status: 'Scheduled',
        appointmentDate: {
          gte: today,
        },
      },
      include: {
        pet: true,
      },
    });

    for (const appt of upcomingAppointments) {
      const apptDate = new Date(appt.appointmentDate);
      apptDate.setHours(0, 0, 0, 0);

      const diffDays = Math.ceil((apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 3) {
        const notifTitle = `Upcoming Vet Visit: ${appt.pet.name}`;
        const existing = await prisma.notification.findFirst({
          where: {
            userId: appt.ownerId,
            petId: appt.petId,
            title: notifTitle,
          },
        });

        if (!existing) {
          await prisma.notification.create({
            data: {
              userId: appt.ownerId,
              petId: appt.petId,
              type: 'Appointment',
              title: notifTitle,
              message: `Reminder: ${appt.pet.name} has an appointment with ${appt.veterinarianName} on ${appt.appointmentDate.toISOString().split('T')[0]} at ${appt.appointmentTime}.`,
              scheduledAt: new Date(),
            },
          });
        }
      }
    }

    console.log('✅ Automated Reminder Engine Scan completed.');
  } catch (error) {
    console.error('❌ Error running reminder engine:', error);
  }
};

export const initCronJobs = (): void => {
  // Run every 6 hours or once a day (0 0 * * *)
  cron.schedule('0 */6 * * *', async () => {
    await runReminderEngine();
  });

  // Run initial scan on startup
  runReminderEngine();
};
