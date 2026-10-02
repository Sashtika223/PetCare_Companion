export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string;
  dob?: string | null;
  age?: string | null;
  gender: string;
  weight?: number | null;
  color?: string | null;
  profileImage?: string | null;
  microchipId?: string | null;
  allergies?: string | null;
  medicalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  vaccinations?: Vaccination[];
  medications?: Medication[];
  appointments?: Appointment[];
  activities?: Activity[];
}

export interface Vaccination {
  id: string;
  petId: string;
  pet?: { id: string; name: string };
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string | null;
  veterinarian?: string | null;
  notes?: string | null;
  status: 'Up to Date' | 'Due Soon' | 'Overdue' | string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  petId: string;
  pet?: { id: string; name: string };
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
  instructions?: string | null;
  prescribedBy?: string | null;
  status: 'Active' | 'Completed' | 'Discontinued' | string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  petId: string;
  pet?: { id: string; name: string; profileImage?: string | null };
  ownerId: string;
  veterinarianName: string;
  clinicName?: string | null;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  notes?: string | null;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  petId: string;
  pet?: { id: string; name: string };
  activityType: 'Walking' | 'Feeding' | 'Playing' | 'Sleeping' | 'Exercise' | 'Grooming' | 'Bathing' | 'Training' | 'Other' | string;
  activityDate: string;
  activityTime?: string | null;
  duration?: number | null;
  quantity?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface CareTip {
  id: string;
  title: string;
  category: 'Nutrition' | 'Grooming' | 'Exercise' | 'Hygiene' | 'Vaccination' | 'Medication' | 'Training' | 'General Health' | 'Safety' | string;
  shortDescription: string;
  detailedContent: string;
  recommendedSpecies: string;
  tags: string[];
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  petId?: string | null;
  pet?: { id: string; name: string } | null;
  type: 'Vaccination' | 'Medication' | 'Appointment' | 'Activity' | 'General' | string;
  title: string;
  message: string;
  scheduledAt: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthData {
  token: string;
  user: User;
}
