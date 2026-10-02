import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';
import { createAppointmentSchema, updateAppointmentSchema } from '../validators/appointmentValidator.js';

export const getAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = req.user!.userId;
    const petId = req.query.petId as string | undefined;
    const status = req.query.status as string | undefined;

    const whereClause: any = { ownerId };

    if (petId) {
      whereClause.petId = petId;
    }

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        pet: {
          select: { id: true, name: true, profileImage: true, species: true },
        },
      },
      orderBy: { appointmentDate: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = req.user!.userId;
    const validatedData = createAppointmentSchema.parse(req.body);

    const pet = await prisma.pet.findFirst({
      where: { id: validatedData.petId, ownerId },
    });

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
      return;
    }

    const appointmentDate = new Date(validatedData.appointmentDate);

    const appointment = await prisma.appointment.create({
      data: {
        petId: validatedData.petId,
        ownerId,
        veterinarianName: validatedData.veterinarianName,
        clinicName: validatedData.clinicName,
        appointmentDate,
        appointmentTime: validatedData.appointmentTime,
        reason: validatedData.reason,
        notes: validatedData.notes,
        status: validatedData.status || 'Scheduled',
      },
      include: {
        pet: { select: { id: true, name: true } },
      },
    });

    // Auto-create notification for scheduled appointment
    await prisma.notification.create({
      data: {
        userId: ownerId,
        petId: pet.id,
        type: 'Appointment',
        title: `Vet Appointment Scheduled: ${pet.name}`,
        message: `Appointment with ${validatedData.veterinarianName} scheduled for ${validatedData.appointmentDate} at ${validatedData.appointmentTime}.`,
        scheduledAt: appointmentDate,
      },
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingAppt = await prisma.appointment.findFirst({
      where: { id, ownerId },
    });

    if (!existingAppt) {
      res.status(404).json({ success: false, message: 'Appointment not found or unauthorized' });
      return;
    }

    const validatedData = updateAppointmentSchema.parse(req.body);

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...validatedData,
        appointmentDate: validatedData.appointmentDate ? new Date(validatedData.appointmentDate) : existingAppt.appointmentDate,
      },
      include: {
        pet: { select: { id: true, name: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingAppt = await prisma.appointment.findFirst({
      where: { id, ownerId },
    });

    if (!existingAppt) {
      res.status(404).json({ success: false, message: 'Appointment not found or unauthorized' });
      return;
    }

    await prisma.appointment.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
