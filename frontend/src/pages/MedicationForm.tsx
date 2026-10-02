import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { medicationFormSchema, MedicationFormInput } from '../validators/medicationSchema';
import { medicationService } from '../services/medicationService';
import { ArrowLeft, Loader2, Pill, Save } from 'lucide-react';

export const MedicationForm: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormInput>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      medicineName: '',
      dosage: '',
      frequency: 'Once daily',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      instructions: '',
      prescribedBy: '',
      status: 'Active',
    },
  });

  const onSubmit = async (data: MedicationFormInput) => {
    if (!petId) return;
    try {
      setServerError(null);
      await medicationService.createMedication(petId, data);
      navigate(`/pets/${petId}/medications`);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to add medication record.');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={`/pets/${petId}/medications`}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-indigo-600" />
            <span>Add Medication Prescription</span>
          </h1>
          <p className="text-xs text-slate-500">Record dosage, administration frequency, and instructions.</p>
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
            Medicine Name *
          </label>
          <input
            type="text"
            {...register('medicineName')}
            placeholder="e.g. Apoquel, Heartgard, Revolution Plus"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {errors.medicineName && <p className="text-xs text-rose-500 mt-1">{errors.medicineName.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Dosage Amount *
            </label>
            <input
              type="text"
              {...register('dosage')}
              placeholder="e.g. 1 tablet, 16mg, 5ml"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {errors.dosage && <p className="text-xs text-rose-500 mt-1">{errors.dosage.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Frequency *
            </label>
            <select
              {...register('frequency')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Start Date *
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {errors.startDate && <p className="text-xs text-rose-500 mt-1">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Prescribed By
          </label>
          <input
            type="text"
            {...register('prescribedBy')}
            placeholder="e.g. Dr. Emily Watson"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Administration Instructions
          </label>
          <textarea
            rows={3}
            {...register('instructions')}
            placeholder="e.g. Give with morning food. Do not crush."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to={`/pets/${petId}/medications`}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-75"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Medication</span>
          </button>
        </div>
      </form>
    </div>
  );
};
