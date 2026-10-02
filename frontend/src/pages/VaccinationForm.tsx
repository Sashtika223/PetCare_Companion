import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { vaccinationFormSchema, VaccinationFormInput } from '../validators/vaccinationSchema';
import { vaccinationService } from '../services/vaccinationService';
import { ArrowLeft, Loader2, Save, Syringe } from 'lucide-react';

export const VaccinationForm: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VaccinationFormInput>({
    resolver: zodResolver(vaccinationFormSchema),
    defaultValues: {
      vaccineName: '',
      vaccinationDate: new Date().toISOString().split('T')[0],
      nextDueDate: '',
      veterinarian: '',
      notes: '',
    },
  });

  const onSubmit = async (data: VaccinationFormInput) => {
    if (!petId) return;
    try {
      setServerError(null);
      await vaccinationService.createVaccination(petId, data);
      navigate(`/pets/${petId}/vaccinations`);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to add vaccination record.');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={`/pets/${petId}/vaccinations`}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Syringe className="w-6 h-6 text-teal-600" />
            <span>Add Vaccination Record</span>
          </h1>
          <p className="text-xs text-slate-500">Record a new vaccine dose and schedule future due dates.</p>
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
            Vaccine Name *
          </label>
          <input
            type="text"
            {...register('vaccineName')}
            placeholder="e.g. Rabies (3-Year), DHPP, FeLV"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          {errors.vaccineName && <p className="text-xs text-rose-500 mt-1">{errors.vaccineName.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Administered Date *
            </label>
            <input
              type="date"
              {...register('vaccinationDate')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.vaccinationDate && (
              <p className="text-xs text-rose-500 mt-1">{errors.vaccinationDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Next Due Date
            </label>
            <input
              type="date"
              {...register('nextDueDate')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Veterinarian / Clinic Name
          </label>
          <input
            type="text"
            {...register('veterinarian')}
            placeholder="e.g. Dr. Emily Watson (Happy Paws Vet)"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Notes / Batch Info
          </label>
          <textarea
            rows={3}
            {...register('notes')}
            placeholder="Add batch serial number or side-effect observations..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to={`/pets/${petId}/vaccinations`}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-75"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Vaccination Record</span>
          </button>
        </div>
      </form>
    </div>
  );
};
