import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';
import { createActivitySchema, updateActivitySchema } from '../validators/activityValidator.js';

export const getActivitiesByPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const petId = req.params.petId as string;
    const ownerId = req.user!.userId;
    const activityType = req.query.activityType as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const pet = await prisma.pet.findFirst({
      where: { id: petId, ownerId },
    });

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
      return;
    }

    const whereClause: any = { petId };

    if (activityType && activityType !== 'All') {
      whereClause.activityType = activityType;
    }

    if (startDate) {
      whereClause.activityDate = {
        gte: new Date(startDate),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      orderBy: { activityDate: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

export const createActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const validatedData = createActivitySchema.parse(req.body);

    const activity = await prisma.activity.create({
      data: {
        petId,
        activityType: validatedData.activityType,
        activityDate: validatedData.activityDate ? new Date(validatedData.activityDate) : new Date(),
        activityTime: validatedData.activityTime,
        duration: validatedData.duration ? Number(validatedData.duration) : null,
        quantity: validatedData.quantity,
        notes: validatedData.notes,
      },
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingAct = await prisma.activity.findFirst({
      where: { id },
      include: { pet: true },
    });

    if (!existingAct || existingAct.pet.ownerId !== ownerId) {
      res.status(404).json({ success: false, message: 'Activity record not found or unauthorized' });
      return;
    }

    const validatedData = updateActivitySchema.parse(req.body);

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...validatedData,
        activityDate: validatedData.activityDate ? new Date(validatedData.activityDate) : existingAct.activityDate,
        duration: validatedData.duration !== undefined ? (validatedData.duration ? Number(validatedData.duration) : null) : existingAct.duration,
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

export const deleteActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const ownerId = req.user!.userId;

    const existingAct = await prisma.activity.findFirst({
      where: { id },
      include: { pet: true },
    });

    if (!existingAct || existingAct.pet.ownerId !== ownerId) {
      res.status(404).json({ success: false, message: 'Activity record not found or unauthorized' });
      return;
    }

    await prisma.activity.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Activity log deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
