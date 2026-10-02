import { z } from 'zod';

export const medicationFormSchema = z.object({
  medicineName: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  instructions: z.string().optional(),
  prescribedBy: z.string().optional(),
  status: z.enum(['Active', 'Completed', 'Discontinued']).optional(),
});

export type MedicationFormInput = z.infer<typeof medicationFormSchema>;
