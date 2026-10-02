import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { appointmentFormSchema, AppointmentFormInput } from '../validators/appointmentSchema';
import { appointmentService } from '../services/appointmentService';
import { petService } from '../services/petService';
import { Pet } from '../types';
import { ArrowLeft, Calendar, Loader2, Save } from 'lucide-react';

export const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormInput>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      petId: '',
      veterinarianName: '',
      clinicName: '',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      reason: '',
      notes: '',
      status: 'Scheduled',
    },
  });

  useEffect(() => {
    fetchUserPets();
  }, []);

  const fetchUserPets = async () => {
    try {
      const data = await petService.getPets();
      setPets(data);
      if (data.length > 0) {
        setValue('petId', data[0].id);
      }
    } catch {
      setServerError('Failed to fetch pet list.');
    } finally {
      setLoadingPets(false);
    }
  };

  const onSubmit = async (data: AppointmentFormInput) => {
    try {
      setServerError(null);
      await appointmentService.createAppointment(data);
      navigate('/appointments');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to schedule appointment.');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/appointments"
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-600" />
            <span>Schedule Vet Appointment</span>
          </h1>
          <p className="text-xs text-slate-500">Book a visit with your veterinarian or clinic.</p>
        </div>
      </div>

      {serverError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-xl">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Select Pet *
          </label>
          {loadingPets ? (
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <select
              {...register('petId')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species} • {p.breed})
                </option>
              ))}
            </select>
          )}
          {errors.petId && <p className="text-xs text-rose-500 mt-1">{errors.petId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Reason for Visit *
          </label>
          <input
            type="text"
            {...register('reason')}
            placeholder="e.g. Annual Checkup, Rabies Booster, Dental Cleaning"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {errors.reason && <p className="text-xs text-rose-500 mt-1">{errors.reason.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Veterinarian Name *
            </label>
            <input
              type="text"
              {...register('veterinarianName')}
              placeholder="e.g. Dr. Emily Watson"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            {errors.veterinarianName && (
              <p className="text-xs text-rose-500 mt-1">{errors.veterinarianName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Clinic / Hospital Name
            </label>
            <input
              type="text"
              {...register('clinicName')}
              placeholder="e.g. Happy Paws Vet Center"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Appointment Date *
            </label>
            <input
              type="date"
              {...register('appointmentDate')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            {errors.appointmentDate && (
              <p className="text-xs text-rose-500 mt-1">{errors.appointmentDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Appointment Time *
            </label>
            <input
              type="text"
              {...register('appointmentTime')}
              placeholder="e.g. 10:30 AM"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            {errors.appointmentTime && (
              <p className="text-xs text-rose-500 mt-1">{errors.appointmentTime.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Preparation Notes
          </label>
          <textarea
            rows={3}
            {...register('notes')}
            placeholder="e.g. Fasting required 8 hours prior. Bring stool sample."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/appointments"
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-75"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Schedule Appointment</span>
          </button>
        </div>
      </form>
    </div>
  );
};
