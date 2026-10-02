import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';
import { createPetSchema, updatePetSchema } from '../validators/petValidator.js';

export const getPets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = req.user!.userId;
    const species = req.query.species as string | undefined;
    const search = req.query.search as string | undefined;

    const whereClause: any = { ownerId };

    if (species && species !== 'All') {
      whereClause.species = { equals: species, mode: 'insensitive' };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { breed: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pets = await prisma.pet.findMany({
      where: whereClause,
      include: {
        vaccinations: { orderBy: { nextDueDate: 'asc' }, take: 3 },
        medications: { where: { status: 'Active' }, take: 3 },
        appointments: { where: { status: 'Scheduled' }, orderBy: { appointmentDate: 'asc' }, take: 3 },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const pet = await prisma.pet.findFirst({
      where: { id, ownerId },
      include: {
        vaccinations: { orderBy: { vaccinationDate: 'desc' } },
        medications: { orderBy: { createdAt: 'desc' } },
        appointments: { orderBy: { appointmentDate: 'desc' } },
        activities: { orderBy: { activityDate: 'desc' }, take: 10 },
      },
    });

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
      return;
    }

    res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = req.user!.userId;
    const validatedData = createPetSchema.parse(req.body);

    const pet = await prisma.pet.create({
      data: {
        ...validatedData,
        dob: validatedData.dob ? new Date(validatedData.dob) : null,
        weight: validatedData.weight ? Number(validatedData.weight) : null,
        ownerId,
      },
    });

    res.status(201).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;
    const validatedData = updatePetSchema.parse(req.body);

    const existingPet = await prisma.pet.findFirst({
      where: { id, ownerId },
    });

    if (!existingPet) {
      res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
      return;
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        ...validatedData,
        dob: validatedData.dob ? new Date(validatedData.dob) : existingPet.dob,
        weight: validatedData.weight !== undefined ? (validatedData.weight ? Number(validatedData.weight) : null) : existingPet.weight,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedPet,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingPet = await prisma.pet.findFirst({
      where: { id, ownerId },
    });

    if (!existingPet) {
      res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
      return;
    }

    await prisma.pet.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Pet profile deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
