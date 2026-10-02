import { z } from 'zod';

export const createVaccinationSchema = z.object({
  vaccineName: z.string().min(1, 'Vaccine name is required'),
  vaccinationDate: z.string().min(1, 'Vaccination date is required'),
  nextDueDate: z.string().optional().nullable(),
  veterinarian: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateVaccinationSchema = createVaccinationSchema.partial();

export type CreateVaccinationInput = z.infer<typeof createVaccinationSchema>;
export type UpdateVaccinationInput = z.infer<typeof updateVaccinationSchema>;
