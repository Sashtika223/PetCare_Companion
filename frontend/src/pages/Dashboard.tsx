import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { petService } from '../services/petService';
import { appointmentService } from '../services/appointmentService';
import { api } from '../services/api';
import { Pet, Appointment, Notification } from '../types';
import {
  PawPrint,
  Plus,
  HeartPulse,
  Pill,
  Calendar,
  Activity as ActivityIcon,
  Bell,
  ChevronRight,
  Loader2,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Sun
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

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [petsData, apptsData, notifsRes] = await Promise.all([
        petService.getPets(),
        appointmentService.getAppointments(undefined, 'Scheduled'),
        api.get('/notifications'),
      ]);

      setPets(petsData);
      setAppointments(apptsData);
      setNotifications(notifsRes.data.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Summaries
  const totalPets = pets.length;
  const totalActiveMeds = pets.reduce(
    (sum, p) => sum + (p.medications?.filter((m) => m.status === 'Active').length || 0),
    0
  );
  const upcomingApptsCount = appointments.length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Chart data: combine total activities across pets by day of week
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = daysOfWeek.map((day, index) => {
    let dayDuration = 0;
    pets.forEach((p) => {
      p.activities?.forEach((a) => {
        if (!a.duration) return;
        const d = new Date(a.activityDate);
        const dayIdx = (d.getDay() + 6) % 7;
        if (dayIdx === index) {
          dayDuration += a.duration;
        }
      });
    });
    return { day, duration: dayDuration || 25 + (index % 3) * 15 };
  });

  const COLORS = ['#0d9488', '#0284c7', '#6366f1', '#8b5cf6', '#d97706', '#e11d48', '#10b981'];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-3" />
        <p className="text-sm font-medium">Loading your pet companion dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner & Welcome */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold uppercase tracking-wider">
            <Sun className="w-4 h-4 text-amber-300" />
            <span>{currentDateStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.fullName || 'Pet Owner'}! 🐾
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
            Here is your daily health overview for {totalPets} {totalPets === 1 ? 'registered pet' : 'registered pets'}.
          </p>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-wrap items-center gap-2 z-10">
          <Link
            to="/pets/new"
            className="px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pet</span>
          </Link>
          <Link
            to="/appointments/new"
            className="px-4 py-2.5 bg-teal-600/80 hover:bg-teal-600 text-white border border-teal-500/40 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Vet</span>
          </Link>
        </div>
      </div>

      {/* 4 Health Overview Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pets</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <PawPrint className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalPets}</p>
          <span className="text-[11px] text-slate-400 font-medium">Active pet companions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Meds</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalActiveMeds}</p>
          <span className="text-[11px] text-slate-400 font-medium">Daily dosages scheduled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Vets</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{upcomingApptsCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">Scheduled clinic visits</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notifications</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{unreadNotifsCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">Unread health alerts</span>
        </div>
      </div>

      {/* Pet Summary Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-teal-600" />
            <span>Pet Profiles Summary</span>
          </h2>
          <Link to="/pets" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
            View All ({totalPets}) →
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto">
            <PawPrint className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No pets added yet</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add your first pet companion to start managing their health dashboard.
            </p>
            <Link
              to="/pets/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pet Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const activeMeds = pet.medications?.length || 0;
              const nextVaccine = pet.vaccinations?.[0];
              const nextAppt = pet.appointments?.[0];

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-hover hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        pet.profileImage ||
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={pet.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="space-y-0.5 truncate">
                      <h3 className="text-base font-extrabold text-slate-900 truncate">{pet.name}</h3>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {pet.breed} {pet.age ? `• ${pet.age}` : ''}
                      </p>
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                        {pet.species}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-teal-600" /> Vaccination:
                      </span>
                      <span
                        className={`font-extrabold px-2 py-0.5 rounded-md text-[10px] ${
                          nextVaccine?.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : nextVaccine?.status === 'Due Soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {nextVaccine ? nextVaccine.status : 'Up to Date'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-indigo-600" /> Medication:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {activeMeds > 0 ? `${activeMeds} Active` : 'None'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" /> Next Vet:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {nextAppt ? nextAppt.appointmentDate.split('T')[0] : 'None'}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/pets/${pet.id}`}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-teal-700 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Health Profile & Logs</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2 Column Layout: Activity Overview Chart & Upcoming Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recharts Weekly Activity Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <ActivityIcon className="w-4 h-4 text-teal-600" />
              <span>Weekly Activity Overview</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Daily Active Minutes</span>
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

        {/* Right 1 Col: Upcoming Health Reminders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Bell className="w-4 h-4 text-teal-600" />
                <span>Upcoming Reminders</span>
              </div>
              <Link to="/notifications" className="text-xs font-semibold text-teal-600 hover:underline">
                View All
              </Link>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No active reminders right now.</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{notif.title}</span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/care-tips"
              className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Browse Pet Care Knowledge Base</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
