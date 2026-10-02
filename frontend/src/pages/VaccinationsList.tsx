import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vaccinationService } from '../services/vaccinationService';
import { petService } from '../services/petService';
import { Vaccination, Pet } from '../types';
import {
  Syringe,
  Plus,
  ArrowLeft,
  Loader2,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserCheck
} from 'lucide-react';

export const VaccinationsList: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (petId) {
      loadData(petId);
    }
  }, [petId]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const [petData, vacsData] = await Promise.all([
        petService.getPetById(id),
        vaccinationService.getVaccinationsByPet(id),
      ]);
      setPet(petData);
      setVaccinations(vacsData);
    } catch (err) {
      console.error('Error loading vaccination data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete record for ${name}?`)) {
      try {
        await vaccinationService.deleteVaccination(id);
        setVaccinations((prev) => prev.filter((v) => v.id !== id));
      } catch {
        alert('Failed to delete vaccination record.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-3" />
        <p className="text-sm font-medium">Loading vaccination history...</p>
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
              <Syringe className="w-6 h-6 text-teal-600" />
              <span>Vaccination Records {pet ? `for ${pet.name}` : ''}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep track of core boosters, rabies shots, and upcoming due dates.
            </p>
          </div>
        </div>

        {petId && (
          <Link
            to={`/pets/${petId}/vaccinations/new`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vaccination</span>
          </Link>
        )}
      </div>

      {/* Vaccination List */}
      {vaccinations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <Syringe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No vaccination records found</h3>
          <p className="text-xs text-slate-500 mb-6">
            Log your pet's past and upcoming vaccines to ensure automated reminders.
          </p>
          {petId && (
            <Link
              to={`/pets/${petId}/vaccinations/new`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record Now</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaccinations.map((vac) => {
            const isOverdue = vac.status === 'Overdue';
            const isDueSoon = vac.status === 'Due Soon';

            return (
              <div
                key={vac.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs hover:border-teal-200 transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{vac.vaccineName}</h3>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md ${
                          isOverdue
                            ? 'bg-rose-100 text-rose-800'
                            : isDueSoon
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {vac.status}
                      </span>
                    </div>
                    {vac.veterinarian && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vac.veterinarian}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(vac.id, vac.vaccineName)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px]">ADMINISTERED DATE</span>
                    <span className="font-semibold text-slate-700">{vac.vaccinationDate.split('T')[0]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px]">NEXT DUE DATE</span>
                    <span
                      className={`font-bold ${
                        isOverdue ? 'text-rose-600' : isDueSoon ? 'text-amber-600' : 'text-slate-700'
                      }`}
                    >
                      {vac.nextDueDate ? vac.nextDueDate.split('T')[0] : 'None set'}
                    </span>
                  </div>
                </div>

                {vac.notes && (
                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
                    "{vac.notes}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
