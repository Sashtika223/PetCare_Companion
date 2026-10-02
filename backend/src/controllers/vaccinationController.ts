import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';
import { createVaccinationSchema, updateVaccinationSchema } from '../validators/vaccinationValidator.js';
import { calculateVaccinationStatus } from '../utils/vaccinationHelper.js';

export const getVaccinationsByPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const vaccinations = await prisma.vaccination.findMany({
      where: { petId },
      orderBy: { vaccinationDate: 'desc' },
    });

    // Update dynamic statuses if necessary
    const updatedVaccinations = await Promise.all(
      vaccinations.map(async (vac) => {
        const calculatedStatus = calculateVaccinationStatus(vac.nextDueDate);
        if (calculatedStatus !== vac.status) {
          return prisma.vaccination.update({
            where: { id: vac.id },
            data: { status: calculatedStatus },
          });
        }
        return vac;
      })
    );

    res.status(200).json({
      success: true,
      data: updatedVaccinations,
    });
  } catch (error) {
    next(error);
  }
};

export const createVaccination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const validatedData = createVaccinationSchema.parse(req.body);
    const nextDueDate = validatedData.nextDueDate ? new Date(validatedData.nextDueDate) : null;
    const status = calculateVaccinationStatus(nextDueDate);

    const vaccination = await prisma.vaccination.create({
      data: {
        petId,
        vaccineName: validatedData.vaccineName,
        vaccinationDate: new Date(validatedData.vaccinationDate),
        nextDueDate,
        veterinarian: validatedData.veterinarian,
        notes: validatedData.notes,
        status,
      },
    });

    if (nextDueDate && (status === 'Due Soon' || status === 'Overdue')) {
      const existingNotif = await prisma.notification.findFirst({
        where: {
          userId: ownerId,
          petId,
          type: 'Vaccination',
          title: { contains: validatedData.vaccineName },
        },
      });

      if (!existingNotif) {
        await prisma.notification.create({
          data: {
            userId: ownerId,
            petId,
            type: 'Vaccination',
            title: `Vaccination ${status}: ${validatedData.vaccineName}`,
            message: `${pet.name} is ${status.toLowerCase()} for ${validatedData.vaccineName} (Due: ${nextDueDate.toISOString().split('T')[0]}).`,
            scheduledAt: new Date(),
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      data: vaccination,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVaccination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingVac = await prisma.vaccination.findFirst({
      where: { id },
      include: { pet: true },
    });

    if (!existingVac || existingVac.pet.ownerId !== ownerId) {
      res.status(404).json({ success: false, message: 'Vaccination record not found or unauthorized' });
      return;
    }

    const validatedData = updateVaccinationSchema.parse(req.body);
    const nextDueDate = validatedData.nextDueDate !== undefined
      ? (validatedData.nextDueDate ? new Date(validatedData.nextDueDate) : null)
      : existingVac.nextDueDate;

    const status = calculateVaccinationStatus(nextDueDate);

    const updated = await prisma.vaccination.update({
      where: { id },
      data: {
        ...validatedData,
        vaccinationDate: validatedData.vaccinationDate ? new Date(validatedData.vaccinationDate) : existingVac.vaccinationDate,
        nextDueDate,
        status,
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

export const deleteVaccination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingVac = await prisma.vaccination.findFirst({
      where: { id },
      include: { pet: true },
    });

    if (!existingVac || existingVac.pet.ownerId !== ownerId) {
      res.status(404).json({ success: false, message: 'Vaccination record not found or unauthorized' });
      return;
    }

    await prisma.vaccination.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Vaccination record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
