import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().min(1, 'Breed is required'),
  dob: z.string().optional().nullable(),
  age: z.string().optional().nullable(),
  gender: z.string().min(1, 'Gender is required'),
  weight: z.number().optional().nullable(),
  color: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  microchipId: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medicalNotes: z.string().optional().nullable(),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
