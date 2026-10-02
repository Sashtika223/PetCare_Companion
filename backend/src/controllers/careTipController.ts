import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';

export const getCareTips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;
    const species = req.query.species as string | undefined;
    const search = req.query.search as string | undefined;

    const whereClause: any = {};

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (species && species !== 'All') {
      whereClause.OR = [
        { recommendedSpecies: 'All' },
        { recommendedSpecies: { equals: species, mode: 'insensitive' } },
      ];
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const careTips = await prisma.careTip.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: careTips,
    });
  } catch (error) {
    next(error);
  }
};

export const getCareTipById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    const tip = await prisma.careTip.findUnique({
      where: { id },
    });

    if (!tip) {
      res.status(404).json({ success: false, message: 'Care tip not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: tip,
    });
  } catch (error) {
    next(error);
  }
};
