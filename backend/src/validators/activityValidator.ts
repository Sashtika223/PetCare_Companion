import { z } from 'zod';

export const createActivitySchema = z.object({
  activityType: z.enum(['Walking', 'Feeding', 'Playing', 'Sleeping', 'Exercise', 'Grooming', 'Bathing', 'Training', 'Other']),
  activityDate: z.string().optional().default(() => new Date().toISOString().split('T')[0]),
  activityTime: z.string().optional().nullable(),
  duration: z.coerce.number().optional().nullable(),
  quantity: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateActivitySchema = createActivitySchema.partial();

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
