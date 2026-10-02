import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { activityFormSchema, ActivityFormInput } from '../validators/activitySchema';
import { activityService } from '../services/activityService';
import { Activity as ActivityIcon, ArrowLeft, Loader2, Save } from 'lucide-react';

export const ActivityForm: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormInput>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activityType: 'Walking',
      activityDate: new Date().toISOString().split('T')[0],
      activityTime: '08:00 AM',
      duration: 30,
      quantity: '',
      notes: '',
    },
  });

  const onSubmit = async (data: ActivityFormInput) => {
    if (!petId) return;
    try {
      setServerError(null);
      await activityService.createActivity(petId, data);
      navigate(`/pets/${petId}/activities`);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to record activity.');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={`/pets/${petId}/activities`}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-teal-600" />
            <span>Record Daily Pet Activity</span>
          </h1>
          <p className="text-xs text-slate-500">Log walks, feedings, exercises, or grooming sessions.</p>
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
            Activity Type *
          </label>
          <select
            {...register('activityType')}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="Walking">Walking 🦮</option>
            <option value="Feeding">Feeding 🍖</option>
            <option value="Playing">Playing 🎾</option>
            <option value="Exercise">Exercise 🏃</option>
            <option value="Sleeping">Sleeping 💤</option>
            <option value="Grooming">Grooming ✂️</option>
            <option value="Bathing">Bathing 🛁</option>
            <option value="Training">Training 🎓</option>
            <option value="Other">Other 🐾</option>
          </select>
          {errors.activityType && <p className="text-xs text-rose-500 mt-1">{errors.activityType.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Activity Date *
            </label>
            <input
              type="date"
              {...register('activityDate')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.activityDate && <p className="text-xs text-rose-500 mt-1">{errors.activityDate.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Time of Day
            </label>
            <input
              type="text"
              {...register('activityTime')}
              placeholder="e.g. 08:00 AM"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              {...register('duration')}
              placeholder="e.g. 30"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Quantity / Distance (Optional)
            </label>
            <input
              type="text"
              {...register('quantity')}
              placeholder="e.g. 2 cups, 3.5 km"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Notes & Behavior Observations
          </label>
          <textarea
            rows={3}
            {...register('notes')}
            placeholder="e.g. High energy, enjoyed playing fetch at the dog park..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to={`/pets/${petId}/activities`}
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
            <span>Record Activity</span>
          </button>
        </div>
      </form>
    </div>
  );
};
