import { z } from 'zod';

export const createMedicationSchema = z.object({
  medicineName: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  prescribedBy: z.string().optional().nullable(),
  status: z.enum(['Active', 'Completed', 'Discontinued']).optional().default('Active'),
});

export const updateMedicationSchema = createMedicationSchema.partial();

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;
