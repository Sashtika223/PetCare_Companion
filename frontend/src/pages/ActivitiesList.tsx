import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { petService } from '../services/petService';
import { Activity, Pet } from '../types';
import {
  Activity as ActivityIcon,
  Plus,
  ArrowLeft,
  Loader2,
  Trash2,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const ActivitiesList: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    if (petId) {
      loadData(petId);
    }
  }, [petId, typeFilter]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const [petData, actsData] = await Promise.all([
        petService.getPetById(id),
        activityService.getActivitiesByPet(id, typeFilter),
      ]);
      setPet(petData);
      setActivities(actsData);
    } catch (err) {
      console.error('Error loading activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this activity log entry?')) {
      try {
        await activityService.deleteActivity(id);
        setActivities((prev) => prev.filter((a) => a.id !== id));
      } catch {
        alert('Failed to delete activity log.');
      }
    }
  };

  const activityTypes = [
    'All',
    'Walking',
    'Feeding',
    'Playing',
    'Sleeping',
    'Exercise',
    'Grooming',
    'Bathing',
    'Training',
    'Other',
  ];

  // Process data for Recharts chart (group total duration by day of week)
  const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
    // Map index to duration sums
    const totalDuration = activities
      .filter((a) => {
        if (!a.duration) return false;
        const d = new Date(a.activityDate);
        const dayIndex = (d.getDay() + 6) % 7; // Convert Sun=0 to Mon=0
        return dayIndex === index;
      })
      .reduce((sum, a) => sum + (a.duration || 0), 0);

    return {
      day,
      duration: totalDuration,
    };
  });

  const COLORS = ['#0d9488', '#0284c7', '#6366f1', '#8b5cf6', '#d97706', '#e11d48', '#10b981'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-3" />
        <p className="text-sm font-medium">Loading activity analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            to={petId ? `/pets/${petId}` : '/pets'}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ActivityIcon className="w-6 h-6 text-teal-600" />
              <span>Activity Log & Analytics {pet ? `for ${pet.name}` : ''}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor exercise durations, feeding routines, and weekly active minutes.
            </p>
          </div>
        </div>

        {petId && (
          <Link
            to={`/pets/${petId}/activities/new`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Activity</span>
          </Link>
        )}
      </div>

      {/* Analytics Chart Card (Recharts) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>Weekly Active Minutes Trend</span>
          </div>
          <span className="text-xs font-medium text-slate-400">Total duration per day (mins)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }}
                itemStyle={{ color: '#2dd4bf', fontWeight: 'bold' }}
                cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              />
              <Bar dataKey="duration" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {activityTypes.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              typeFilter === type
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Activity Logs Grid */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <ActivityIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No activities logged yet</h3>
          <p className="text-xs text-slate-500 mb-6">
            Log daily walks, feeding amounts, or playtime to build your pet's activity history.
          </p>
          {petId && (
            <Link
              to={`/pets/${petId}/activities/new`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Activity</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2 shadow-xs hover:border-teal-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 font-extrabold text-xs rounded-lg">
                    {act.activityType}
                  </span>
                  <button
                    onClick={() => handleDelete(act.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-1">
                  {act.duration && (
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>{act.duration} minutes</span>
                    </p>
                  )}
                  {act.quantity && (
                    <p className="text-xs font-semibold text-slate-700">Quantity: {act.quantity}</p>
                  )}
                  {act.notes && (
                    <p className="text-xs text-slate-500 italic mt-1">"{act.notes}"</p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{act.activityDate.split('T')[0]}</span>
                {act.activityTime && <span>{act.activityTime}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
