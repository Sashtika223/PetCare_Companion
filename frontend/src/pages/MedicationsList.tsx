import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicationService } from '../services/medicationService';
import { petService } from '../services/petService';
import { Medication, Pet } from '../types';
import {
  Pill,
  Plus,
  ArrowLeft,
  Loader2,
  Trash2,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MedicationsList: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed' | 'Discontinued'>('All');

  useEffect(() => {
    if (petId) {
      loadData(petId);
    }
  }, [petId]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const [petData, medsData] = await Promise.all([
        petService.getPetById(id),
        medicationService.getMedicationsByPet(id),
      ]);
      setPet(petData);
      setMedications(medsData);
    } catch (err) {
      console.error('Error loading medication data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        await medicationService.deleteMedication(id);
        setMedications((prev) => prev.filter((m) => m.id !== id));
      } catch {
        alert('Failed to delete medication.');
      }
    }
  };

  const filteredMeds = medications.filter((m) => {
    if (statusFilter === 'All') return true;
    return m.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Loading medication schedule...</p>
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
              <Pill className="w-6 h-6 text-indigo-600" />
              <span>Medication Schedule {pet ? `for ${pet.name}` : ''}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track daily prescriptions, dosage instructions, and active treatments.
            </p>
          </div>
        </div>

        {petId && (
          <Link
            to={`/pets/${petId}/medications/new`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['All', 'Active', 'Completed', 'Discontinued'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === status
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Medication Cards Grid */}
      {filteredMeds.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No medication records found</h3>
          <p className="text-xs text-slate-500 mb-6">
            Log active prescriptions to ensure dosage reminders.
          </p>
          {petId && (
            <Link
              to={`/pets/${petId}/medications/new`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record Now</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeds.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{med.medicineName}</h3>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md ${
                        med.status === 'Active'
                          ? 'bg-indigo-100 text-indigo-800'
                          : med.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {med.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600">
                    Dosage: <strong className="text-slate-900">{med.dosage}</strong> • {med.frequency}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(med.id, med.medicineName)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {med.instructions && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-medium">
                  <strong>Instructions:</strong> {med.instructions}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Start: {med.startDate.split('T')[0]}</span>
                {med.prescribedBy && <span>Prescribed by: {med.prescribedBy}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
