import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types';
import {
  Calendar,
  Plus,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  User,
  Building,
  Clock,
  ChevronRight
} from 'lucide-react';

export const AppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await appointmentService.updateAppointment(id, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch {
      alert('Failed to update appointment status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(id);
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      } catch {
        alert('Failed to delete appointment.');
      }
    }
  };

  const upcomingList = appointments.filter(
    (a) => a.status === 'Scheduled' || a.status === 'Rescheduled'
  );
  const pastList = appointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Cancelled'
  );

  const displayedList = activeTab === 'Upcoming' ? upcomingList : pastList;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
        <p className="text-sm font-medium">Loading veterinary appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-600" />
            <span>Veterinary Appointments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule clinic visits, routine physical checkups, and dental cleanings.
          </p>
        </div>

        <Link
          to="/appointments/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Appointment</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('Upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'Upcoming'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Upcoming Appointments</span>
          <span className="px-2 py-0.5 text-[10px] bg-white/20 rounded-full font-bold">
            {upcomingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'Past'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Appointment History</span>
          <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-bold">
            {pastList.length}
          </span>
        </button>
      </div>

      {/* List */}
      {displayedList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No {activeTab.toLowerCase()} appointments
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Keep your pets healthy by scheduling annual checkups with your trusted veterinarian.
          </p>
          <Link
            to="/appointments/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Visit</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:border-amber-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold flex flex-col items-center justify-center shrink-0 border border-amber-100">
                  <span className="text-[10px] uppercase font-extrabold text-amber-700">
                    {new Date(appt.appointmentDate).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-base font-black leading-none">
                    {new Date(appt.appointmentDate).getDate()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{appt.reason}</h3>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md ${
                        appt.status === 'Scheduled'
                          ? 'bg-amber-100 text-amber-800'
                          : appt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-teal-700">
                    Pet: {appt.pet?.name || 'My Pet'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {appt.appointmentTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {appt.veterinarianName}
                    </span>
                    {appt.clinicName && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {appt.clinicName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                {appt.status === 'Scheduled' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDelete(appt.id)}
                  title="Delete Appointment"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
