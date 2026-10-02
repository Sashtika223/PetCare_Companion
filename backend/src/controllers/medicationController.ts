import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';
import { createMedicationSchema, updateMedicationSchema } from '../validators/medicationValidator.js';

export const getMedicationsByPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const petId = req.params.petId as string;
    const ownerId = req.user!.userId;

    const pet = await prisma.pet.findFirst({
      where: { id: petId, ownerId },
    });

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
      return;
    }

    const medications = await prisma.medication.findMany({
      where: { petId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: medications,
    });
  } catch (error) {
    next(error);
  }
};

export const createMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const petId = req.params.petId as string;
    const ownerId = req.user!.userId;

    const pet = await prisma.pet.findFirst({
      where: { id: petId, ownerId },
    });

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
      return;
    }

    const validatedData = createMedicationSchema.parse(req.body);

    const medication = await prisma.medication.create({
      data: {
        petId,
        medicineName: validatedData.medicineName,
        dosage: validatedData.dosage,
        frequency: validatedData.frequency,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        instructions: validatedData.instructions,
        prescribedBy: validatedData.prescribedBy,
        status: validatedData.status || 'Active',
      },
    });

    // Auto-create notification for new active medication schedule
    await prisma.notification.create({
      data: {
        userId: ownerId,
        petId,
        type: 'Medication',
        title: `Medication Scheduled: ${validatedData.medicineName}`,
        message: `${pet.name} is prescribed ${validatedData.medicineName} (${validatedData.dosage}, ${validatedData.frequency}).`,
        scheduledAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: medication,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingMed = await prisma.medication.findFirst({
      where: { id },
      include: { pet: true },
    });

    if (!existingMed || existingMed.pet.ownerId !== ownerId) {
      res.status(404).json({ success: false, message: 'Medication record not found or unauthorized' });
      return;
    }

    const validatedData = updateMedicationSchema.parse(req.body);

    const updated = await prisma.medication.update({
      where: { id },
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : existingMed.startDate,
        endDate: validatedData.endDate !== undefined ? (validatedData.endDate ? new Date(validatedData.endDate) : null) : existingMed.endDate,
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

export const deleteMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingMed = await prisma.medication.findFirst({
      where: { id },
      include: { pet: true },
    });

    if (!existingMed || existingMed.pet.ownerId !== ownerId) {
      res.status(404).json({ success: false, message: 'Medication record not found or unauthorized' });
      return;
    }

    await prisma.medication.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Medication record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
