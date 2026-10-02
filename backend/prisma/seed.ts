import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.vaccination.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.careTip.deleteMany();

  // 1. Create Demo User
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.create({
    data: {
      fullName: 'Sarah Jenkins',
      email: 'demo@petcare.com',
      password: hashedPassword,
    },
  });
  console.log(`👤 Created user: ${user.fullName} (${user.email})`);

  // 2. Create Demo Pets
  const max = await prisma.pet.create({
    data: {
      ownerId: user.id,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      dob: new Date('2022-04-15'),
      age: '3 years',
      gender: 'Male',
      weight: 31.5,
      color: 'Golden',
      profileImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      microchipId: '985141002345678',
      allergies: 'Chicken, Flea bites',
      medicalNotes: 'Sensitive stomach. Requires grain-free diet.',
    },
  });

  const luna = await prisma.pet.create({
    data: {
      ownerId: user.id,
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      dob: new Date('2023-08-10'),
      age: '1.5 years',
      gender: 'Female',
      weight: 4.2,
      color: 'Seal Point',
      profileImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      microchipId: '985141009876543',
      allergies: 'None',
      medicalNotes: 'Up to date with indoor cat wellness plan.',
    },
  });
  console.log(`🐾 Created pets: ${max.name} & ${luna.name}`);

  // 3. Create Vaccinations
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const fiveDaysLater = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

  await prisma.vaccination.createMany({
    data: [
      {
        petId: max.id,
        vaccineName: 'Rabies (3-Year)',
        vaccinationDate: new Date('2024-01-10'),
        nextDueDate: thirtyDaysLater,
        veterinarian: 'Dr. Emily Watson (Happy Paws Vet)',
        notes: 'Annual booster required next month.',
        status: 'Due Soon',
      },
      {
        petId: max.id,
        vaccineName: 'DHPP (Distemper, Hepatitis, Parvovirus)',
        vaccinationDate: new Date('2024-03-20'),
        nextDueDate: new Date('2026-03-20'),
        veterinarian: 'Dr. Emily Watson',
        notes: 'Core vaccination given.',
        status: 'Up to Date',
      },
      {
        petId: luna.id,
        vaccineName: 'FVRCP (Feline Viral Rhinotracheitis)',
        vaccinationDate: new Date('2023-09-01'),
        nextDueDate: fiveDaysLater,
        veterinarian: 'Dr. Mark Vance (Metro Cat Clinic)',
        notes: 'Booster scheduled.',
        status: 'Due Soon',
      },
      {
        petId: luna.id,
        vaccineName: 'Feline Leukemia (FeLV)',
        vaccinationDate: new Date('2023-05-15'),
        nextDueDate: tenDaysAgo,
        veterinarian: 'Dr. Mark Vance',
        notes: 'Overdue for annual check.',
        status: 'Overdue',
      }
    ],
  });
  console.log('💉 Created vaccination records');

  // 4. Create Medications
  await prisma.medication.createMany({
    data: [
      {
        petId: max.id,
        medicineName: 'Apoquel 16mg',
        dosage: '1 tablet',
        frequency: 'Once daily',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-12-31'),
        instructions: 'Give with morning food for skin allergies.',
        prescribedBy: 'Dr. Emily Watson',
        status: 'Active',
      },
      {
        petId: max.id,
        medicineName: 'Heartgard Plus',
        dosage: '1 chewable',
        frequency: 'Monthly',
        startDate: new Date('2025-01-01'),
        instructions: 'Give on the 1st of every month.',
        prescribedBy: 'Dr. Emily Watson',
        status: 'Active',
      },
      {
        petId: luna.id,
        medicineName: 'Revolution Plus',
        dosage: '1 pipette',
        frequency: 'Monthly',
        startDate: new Date('2025-01-01'),
        instructions: 'Apply topically between shoulder blades.',
        prescribedBy: 'Dr. Mark Vance',
        status: 'Active',
      },
    ],
  });
  console.log('💊 Created medication records');

  // 5. Create Appointments
  await prisma.appointment.createMany({
    data: [
      {
        petId: max.id,
        ownerId: user.id,
        veterinarianName: 'Dr. Emily Watson',
        clinicName: 'Happy Paws Veterinary Center',
        appointmentDate: fiveDaysLater,
        appointmentTime: '10:30 AM',
        reason: 'Annual Physical & Rabies Booster',
        notes: 'Bring stool sample.',
        status: 'Scheduled',
      },
      {
        petId: luna.id,
        ownerId: user.id,
        veterinarianName: 'Dr. Mark Vance',
        clinicName: 'Metro Cat Clinic',
        appointmentDate: thirtyDaysLater,
        appointmentTime: '02:00 PM',
        reason: 'Dental Examination & Cleaning',
        notes: 'Fasting required 8 hours prior.',
        status: 'Scheduled',
      },
    ],
  });
  console.log('📅 Created appointment records');

  // 6. Create Daily Activities
  const dates = [0, 1, 2, 3, 4, 5, 6].map(days => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  });

  for (const d of dates) {
    await prisma.activity.create({
      data: {
        petId: max.id,
        activityType: 'Walking',
        activityDate: d,
        activityTime: '08:00 AM',
        duration: 35 + Math.floor(Math.random() * 20),
        quantity: '3.2 km',
        notes: 'Morning neighborhood stroll.',
      },
    });
    await prisma.activity.create({
      data: {
        petId: max.id,
        activityType: 'Feeding',
        activityDate: d,
        activityTime: '06:30 PM',
        quantity: '2 cups kibble',
        notes: 'Apoquel added to meal.',
      },
    });
    await prisma.activity.create({
      data: {
        petId: luna.id,
        activityType: 'Playing',
        activityDate: d,
        activityTime: '07:00 PM',
        duration: 20,
        notes: 'Feather wand session.',
      },
    });
  }
  console.log('🎾 Created activity records');

  // 7. Create Pet Care Tips
  await prisma.careTip.createMany({
    data: [
      {
        title: 'Essential Dog Nutrition & Hydration',
        category: 'Nutrition',
        shortDescription: 'Learn how to maintain balanced meals and optimal hydration for dogs of all sizes.',
        detailedContent: `A healthy canine diet requires a proper ratio of protein, healthy fats, vitamins, and minerals. Ensure clean, fresh water is accessible 24/7. Avoid toxic foods such as chocolate, grapes, raisins, onions, garlic, and artificial sweeteners like xylitol.\n\nConsult a veterinarian before switching diet formulations or introducing new raw foods.`,
        recommendedSpecies: 'Dog',
        tags: ['Nutrition', 'Diet', 'Hydration', 'Safety'],
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Feline Dental Hygiene Routine',
        category: 'Grooming',
        shortDescription: 'Prevent periodontal disease in cats with daily brushing and dental treats.',
        detailedContent: `Over 70% of cats develop dental disease by age three. Use enzymatic pet-safe toothpaste (never human toothpaste, which contains fluoride/xylitol) and a soft finger brush. Introduce brushing gradually with positive reinforcement.`,
        recommendedSpecies: 'Cat',
        tags: ['Dental', 'Grooming', 'Hygiene', 'Cat Care'],
        image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Core Vaccination Schedules for Pets',
        category: 'Vaccination',
        shortDescription: 'Understanding rabies, DHPP, and FVRCP vaccine timelines.',
        detailedContent: `Vaccinations shield your pets against life-threatening viral infections. Core vaccines are recommended for every pet, while non-core vaccines (such as Bordetella or Lyme) depend on lifestyle and regional exposure risk.`,
        recommendedSpecies: 'All',
        tags: ['Vaccination', 'Health', 'Preventative'],
        image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Safely Administering Medication to Pets',
        category: 'Medication',
        shortDescription: 'Tips for pill pockets, liquid drops, and liquid syringes without stress.',
        detailedContent: `Giving medicine can be stress-free. For dogs, try pill pockets or peanut butter (xylitol-free). For cats, tilt the head gently back, press the mouth corners open softly, place the pill at the back of the tongue, and follow with water or treat broth.`,
        recommendedSpecies: 'All',
        tags: ['Medication', 'Tips', 'Care'],
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Daily Exercise & Mental Stimulation',
        category: 'Exercise',
        shortDescription: 'Interactive toys, puzzle feeders, and daily walk strategies.',
        detailedContent: `Boredom leads to anxiety and destructive behavior. Provide puzzle toys, scent walks, and regular playtime. Dogs need 30–60 minutes of daily physical exercise, while cats thrive on 15-minute energetic play bursts.`,
        recommendedSpecies: 'All',
        tags: ['Exercise', 'Enrichment', 'Behavior'],
        image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80',
      },
    ],
  });
  console.log('📚 Created care tips');

  // 8. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        petId: max.id,
        type: 'Vaccination',
        title: 'Vaccination Due Soon',
        message: 'Max is due for Rabies (3-Year) vaccination in 30 days.',
        isRead: false,
      },
      {
        userId: user.id,
        petId: luna.id,
        type: 'Vaccination',
        title: 'Vaccination Overdue',
        message: 'Luna is overdue for Feline Leukemia (FeLV) vaccination.',
        isRead: false,
      },
      {
        userId: user.id,
        petId: max.id,
        type: 'Appointment',
        title: 'Upcoming Vet Appointment',
        message: 'Appointment scheduled with Dr. Emily Watson in 5 days at 10:30 AM.',
        isRead: true,
      },
    ],
  });
  console.log('🔔 Created notifications');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
