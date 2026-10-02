import { z } from 'zod';

export const petFormSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().min(1, 'Breed is required'),
  dob: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  weight: z.coerce.number().optional().nullable(),
  color: z.string().optional(),
  profileImage: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  microchipId: z.string().optional(),
  allergies: z.string().optional(),
  medicalNotes: z.string().optional(),
});

export type PetFormInput = z.infer<typeof petFormSchema>;
