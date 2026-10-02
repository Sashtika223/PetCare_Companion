import { z } from 'zod';

export const activityFormSchema = z.object({
  activityType: z.enum(['Walking', 'Feeding', 'Playing', 'Sleeping', 'Exercise', 'Grooming', 'Bathing', 'Training', 'Other']),
  activityDate: z.string().min(1, 'Date is required'),
  activityTime: z.string().optional(),
  duration: z.coerce.number().optional().nullable(),
  quantity: z.string().optional(),
  notes: z.string().optional(),
});

export type ActivityFormInput = z.infer<typeof activityFormSchema>;
