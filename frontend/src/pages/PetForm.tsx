import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { petFormSchema, PetFormInput } from '../validators/petSchema';
import { petService } from '../services/petService';
import { ArrowLeft, Loader2, PawPrint, Save, Image as ImageIcon } from 'lucide-react';

export const PetForm: React.FC = () => {
  const { petId } = useParams<{ petId?: string }>();
  const isEditing = !!petId;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PetFormInput>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: '',
      species: 'Dog',
      breed: '',
      gender: 'Male',
      dob: '',
      age: '',
      weight: undefined,
      color: '',
      profileImage: '',
      microchipId: '',
      allergies: '',
      medicalNotes: '',
    },
  });

  const previewImage = watch('profileImage');

  useEffect(() => {
    if (isEditing && petId) {
      fetchPetDetails(petId);
    }
  }, [petId]);

  const fetchPetDetails = async (id: string) => {
    try {
      setLoading(true);
      const pet = await petService.getPetById(id);
      reset({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        gender: pet.gender,
        dob: pet.dob ? pet.dob.split('T')[0] : '',
        age: pet.age || '',
        weight: pet.weight || undefined,
        color: pet.color || '',
        profileImage: pet.profileImage || '',
        microchipId: pet.microchipId || '',
        allergies: pet.allergies || '',
        medicalNotes: pet.medicalNotes || '',
      });
    } catch (err) {
      setServerError('Failed to load pet details.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PetFormInput) => {
    try {
      setServerError(null);
      if (isEditing && petId) {
        await petService.updatePet(petId, data);
      } else {
        await petService.createPet(data);
      }
      navigate('/pets');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to save pet profile.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
        <p className="text-sm font-medium">Loading pet data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/pets"
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Pet Profile' : 'Register New Pet'}
          </h1>
          <p className="text-xs text-slate-500">
            {isEditing ? 'Update medical notes, weight, or profile details.' : 'Create a new companion profile.'}
          </p>
        </div>
      </div>

      {serverError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-xl">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 space-y-6 shadow-xs">
        {/* Profile Image Preview */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden shrink-0 border-2 border-white shadow-xs flex items-center justify-center">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <PawPrint className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Profile Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                {...register('profileImage')}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Paste a photo link for your pet profile image.</p>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pet Name *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Max"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Species *
            </label>
            <select
              {...register('species')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="Dog">Dog 🐶</option>
              <option value="Cat">Cat 🐱</option>
              <option value="Bird">Bird 🦜</option>
              <option value="Rabbit">Rabbit 🐰</option>
              <option value="Other">Other 🐾</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Breed *
            </label>
            <input
              type="text"
              {...register('breed')}
              placeholder="e.g. Golden Retriever"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.breed && <p className="text-xs text-rose-500 mt-1">{errors.breed.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Gender *
            </label>
            <select
              {...register('gender')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Neutered Male">Neutered Male</option>
              <option value="Spayed Female">Spayed Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              {...register('dob')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Age Text (Display)
            </label>
            <input
              type="text"
              {...register('age')}
              placeholder="e.g. 3 years"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('weight')}
              placeholder="e.g. 31.5"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Color / Markings
            </label>
            <input
              type="text"
              {...register('color')}
              placeholder="e.g. Golden brown"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Microchip ID
            </label>
            <input
              type="text"
              {...register('microchipId')}
              placeholder="e.g. 985141002345678"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Known Allergies
            </label>
            <input
              type="text"
              {...register('allergies')}
              placeholder="e.g. Chicken, Flea bites, Pollen"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Medical & Dietary Notes
            </label>
            <textarea
              rows={3}
              {...register('medicalNotes')}
              placeholder="Record any special dietary needs, health conditions, or care instructions..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/pets"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 disabled:opacity-75"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isEditing ? 'Save Changes' : 'Save Pet Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
