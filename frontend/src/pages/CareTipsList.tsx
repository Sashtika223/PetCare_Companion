import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { careTipService } from '../services/careTipService';
import { CareTip } from '../types';
import {
  BookOpen,
  Search,
  Tag,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export const CareTipsList: React.FC = () => {
  const [tips, setTips] = useState<CareTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Nutrition',
    'Grooming',
    'Exercise',
    'Hygiene',
    'Vaccination',
    'Medication',
    'Training',
    'General Health',
    'Safety',
  ];

  useEffect(() => {
    fetchTips();
  }, [selectedCategory, searchQuery]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const data = await careTipService.getCareTips(selectedCategory, undefined, searchQuery);
      setTips(data);
    } catch (err) {
      console.error('Failed to fetch care tips:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-8 rounded-3xl shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pet Care Knowledge Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Expert Pet Care Tips & Guides</h1>
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
            Discover essential advice on nutrition, dental hygiene, exercise enrichment, and medication safety.
          </p>
        </div>
      </div>

      {/* Vet Disclaimer Notice */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Veterinary Health Disclaimer:</strong> All care tips provided in this knowledge base are for general educational purposes only. For urgent symptoms, prescription changes, or medical diagnoses, please consult a qualified licensed veterinarian.
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search care tips by topic, keyword, or tag..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : tips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No care tips matched your query</h3>
          <p className="text-xs text-slate-500">Try clearing your search terms or selecting another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-hover hover:border-teal-200 transition-all flex flex-col justify-between group"
            >
              <div>
                {tip.image && (
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={tip.image}
                      alt={tip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase">
                      {tip.category}
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {tip.title}
                  </h2>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {tip.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tip.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                <Link
                  to={`/care-tips/${tip.id}`}
                  className="w-full py-2 px-3 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-teal-700 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Read Full Article</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
