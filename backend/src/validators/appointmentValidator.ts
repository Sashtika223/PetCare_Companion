import { z } from 'zod';

export const createAppointmentSchema = z.object({
  petId: z.string().min(1, 'Pet selection is required'),
  veterinarianName: z.string().min(1, 'Veterinarian name is required'),
  clinicName: z.string().optional().nullable(),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  reason: z.string().min(1, 'Reason for appointment is required'),
  notes: z.string().optional().nullable(),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'Rescheduled']).optional().default('Scheduled'),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
