import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { petService } from '../services/petService';
import { Pet } from '../types';
import {
  Plus,
  Search,
  PawPrint,
  HeartPulse,
  Pill,
  Calendar,
  ChevronRight,
  Filter,
  Loader2,
  Trash2,
  Edit
} from 'lucide-react';

export const PetsList: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPets();
  }, [speciesFilter, searchQuery]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await petService.getPets(speciesFilter, searchQuery);
      setPets(data);
    } catch (err) {
      console.error('Failed to fetch pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`Are you sure you want to remove ${name} from your pet companion list?`)) {
      try {
        await petService.deletePet(id);
        setPets((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert('Failed to delete pet.');
      }
    }
  };

  const speciesList = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-teal-600" />
            <span>My Pet Companions</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your pet profiles, health records, medical histories, and reminders.
          </p>
        </div>

        <Link
          to="/pets/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-600/20 transition-all shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Pet</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
        
        {/* Species Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {speciesList.map((species) => (
            <button
              key={species}
              onClick={() => setSpeciesFilter(species)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                speciesFilter === species
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {species}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or breed..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Pets Grid / States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No pets registered yet</h3>
          <p className="text-slate-500 text-sm mb-6">
            Add your first pet to start managing their vaccination history, active medications, and care routines.
          </p>
          <Link
            to="/pets/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-600/15"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Pet</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => {
            const activeMedsCount = pet.medications?.length || 0;
            const upcomingAppt = pet.appointments?.[0];
            const nextVaccine = pet.vaccinations?.[0];

            return (
              <div
                key={pet.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-hover hover:border-teal-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Header */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={
                        pet.profileImage ||
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <Link
                        to={`/pets/${pet.id}/edit`}
                        title="Edit Pet"
                        className="p-2 bg-white/90 backdrop-blur-md text-slate-700 rounded-xl hover:bg-white transition-colors shadow-xs"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={(e) => handleDeletePet(pet.id, pet.name, e)}
                        title="Delete Pet"
                        className="p-2 bg-white/90 backdrop-blur-md text-rose-600 rounded-xl hover:bg-white transition-colors shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                      {pet.species} • {pet.gender}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {pet.name}
                        </h2>
                        {pet.weight && (
                          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                            {pet.weight} kg
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{pet.breed} {pet.age ? `• ${pet.age}` : ''}</p>
                    </div>

                    {/* Care Stats Badges */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <HeartPulse className="w-3.5 h-3.5 text-teal-600" /> Vaccination:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {nextVaccine ? nextVaccine.status : 'Up to Date'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-indigo-600" /> Medications:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {activeMedsCount > 0 ? `${activeMedsCount} Active` : 'None'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" /> Next Vet:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {upcomingAppt ? upcomingAppt.appointmentDate.split('T')[0] : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                  <Link
                    to={`/pets/${pet.id}`}
                    className="w-full py-2.5 px-4 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-teal-700 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>View Health Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
