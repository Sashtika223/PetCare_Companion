import { z } from 'zod';

export const appointmentFormSchema = z.object({
  petId: z.string().min(1, 'Please select a pet'),
  veterinarianName: z.string().min(1, 'Veterinarian name is required'),
  clinicName: z.string().optional(),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
  reason: z.string().min(1, 'Reason for appointment is required'),
  notes: z.string().optional(),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'Rescheduled']).optional(),
});

export type AppointmentFormInput = z.infer<typeof appointmentFormSchema>;
