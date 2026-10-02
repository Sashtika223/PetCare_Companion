import { z } from 'zod';

export const vaccinationFormSchema = z.object({
  vaccineName: z.string().min(1, 'Vaccine name is required'),
  vaccinationDate: z.string().min(1, 'Vaccination date is required'),
  nextDueDate: z.string().optional(),
  veterinarian: z.string().optional(),
  notes: z.string().optional(),
});

export type VaccinationFormInput = z.infer<typeof vaccinationFormSchema>;
