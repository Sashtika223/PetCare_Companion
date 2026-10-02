import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { petService } from '../services/petService';
import { Pet } from '../types';
import {
  PawPrint,
  HeartPulse,
  Pill,
  Calendar,
  Activity as ActivityIcon,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  FileText,
  Weight,
  Syringe,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const PetProfile: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (petId) {
      fetchPetProfile(petId);
    }
  }, [petId]);

  const fetchPetProfile = async (id: string) => {
    try {
      setLoading(true);
      const data = await petService.getPetById(id);
      setPet(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load pet health profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async () => {
    if (!pet) return;
    if (window.confirm(`Are you sure you want to permanently delete ${pet.name}'s profile?`)) {
      try {
        await petService.deletePet(pet.id);
        navigate('/pets');
      } catch {
        alert('Failed to delete pet.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-3" />
        <p className="text-sm font-medium">Fetching pet health & profile records...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Pet Profile Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'The pet profile you are looking for does not exist.'}</p>
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to My Pets</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pet Companions</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/pets/${pet.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
          <button
            onClick={handleDeletePet}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-4 border-slate-50 shadow-md">
            <img
              src={
                pet.profileImage ||
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
              }
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{pet.name}</h1>
              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                {pet.species}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {pet.gender}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {pet.breed} {pet.age ? `• ${pet.age}` : ''} {pet.color ? `• ${pet.color}` : ''}
            </p>

            {/* Microchip & Key Info */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-center sm:justify-start gap-6 text-xs text-slate-600">
              {pet.weight && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Weight className="w-4 h-4 text-teal-600" />
                  <span>Weight: <strong className="text-slate-900">{pet.weight} kg</strong></span>
                </div>
              )}

              {pet.microchipId && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Microchip: <strong className="text-slate-900">{pet.microchipId}</strong></span>
                </div>
              )}

              {pet.dob && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>DOB: <strong className="text-slate-900">{pet.dob.split('T')[0]}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Allergies & Medical Notes Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Allergies & Sensitivities</span>
          </div>
          <p className="text-xs text-amber-900 font-medium">
            {pet.allergies || 'No known food or environmental allergies recorded.'}
          </p>
        </div>

        <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Medical & Care Notes</span>
          </div>
          <p className="text-xs text-blue-900 font-medium">
            {pet.medicalNotes || 'No special dietary or medical notes added.'}
          </p>
        </div>
      </div>

      {/* 3-Column Healthcare Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Vaccinations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Syringe className="w-4 h-4 text-teal-600" />
              <span>Vaccination History</span>
            </div>
            <Link
              to={`/pets/${pet.id}/vaccinations/new`}
              className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </Link>
          </div>

          {!pet.vaccinations || pet.vaccinations.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No vaccination records added yet.</p>
          ) : (
            <div className="space-y-3">
              {pet.vaccinations.map((vac) => (
                <div key={vac.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{vac.vaccineName}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        vac.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-700'
                          : vac.status === 'Due Soon'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {vac.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Given: {vac.vaccinationDate.split('T')[0]} • Next: {vac.nextDueDate ? vac.nextDueDate.split('T')[0] : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            to={`/pets/${pet.id}/vaccinations`}
            className="block text-center text-xs font-semibold text-teal-600 hover:text-teal-700 pt-2 border-t border-slate-100"
          >
            Manage All Vaccinations →
          </Link>
        </div>

        {/* Column 2: Medications */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Pill className="w-4 h-4 text-indigo-600" />
              <span>Medication Schedule</span>
            </div>
            <Link
              to={`/pets/${pet.id}/medications/new`}
              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </Link>
          </div>

          {!pet.medications || pet.medications.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No active medications scheduled.</p>
          ) : (
            <div className="space-y-3">
              {pet.medications.map((med) => (
                <div key={med.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{med.medicineName}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded-md">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Frequency: {med.frequency} • {med.instructions}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            to={`/pets/${pet.id}/medications`}
            className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 pt-2 border-t border-slate-100"
          >
            Manage All Medications →
          </Link>
        </div>

        {/* Column 3: Upcoming Vet Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Vet Appointments</span>
            </div>
            <Link
              to="/appointments/new"
              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book</span>
            </Link>
          </div>

          {!pet.appointments || pet.appointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No upcoming appointments scheduled.</p>
          ) : (
            <div className="space-y-3">
              {pet.appointments.map((appt) => (
                <div key={appt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{appt.reason}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {appt.appointmentDate.split('T')[0]} at {appt.appointmentTime} ({appt.veterinarianName})
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/appointments"
            className="block text-center text-xs font-semibold text-amber-600 hover:text-amber-700 pt-2 border-t border-slate-100"
          >
            View All Appointments →
          </Link>
        </div>
      </div>

      {/* Daily Activity Log Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-teal-600" />
              <span>Recent Daily Activities</span>
            </h3>
            <p className="text-xs text-slate-500">Logged walks, feedings, exercises, and grooming routines.</p>
          </div>
          <Link
            to={`/pets/${pet.id}/activities/new`}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Activity</span>
          </Link>
        </div>

        {!pet.activities || pet.activities.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">No recent activities logged for {pet.name}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pet.activities.map((act) => (
              <div key={act.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md">
                    {act.activityType}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {act.activityDate.split('T')[0]}
                  </span>
                </div>
                {act.duration && (
                  <p className="text-xs font-medium text-slate-700">Duration: {act.duration} mins</p>
                )}
                {act.quantity && (
                  <p className="text-xs font-medium text-slate-700">Quantity: {act.quantity}</p>
                )}
                {act.notes && (
                  <p className="text-[11px] text-slate-500 italic">"{act.notes}"</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 text-right">
          <Link
            to={`/pets/${pet.id}/activities`}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            View Full Activity Log & Charts →
          </Link>
        </div>
      </div>
    </div>
  );
};
