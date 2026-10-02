import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { careTipService } from '../services/careTipService';
import { CareTip } from '../types';
import { ArrowLeft, BookOpen, Loader2, ShieldAlert, Tag, Calendar, PawPrint } from 'lucide-react';

export const CareTipDetail: React.FC = () => {
  const { tipId } = useParams<{ tipId: string }>();
  const [tip, setTip] = useState<CareTip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tipId) {
      fetchTip(tipId);
    }
  }, [tipId]);

  const fetchTip = async (id: string) => {
    try {
      setLoading(true);
      const data = await careTipService.getCareTipById(id);
      setTip(data);
    } catch (err) {
      console.error('Failed to load care tip:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-3" />
        <p className="text-sm font-medium">Loading article details...</p>
      </div>
    );
  }

  if (!tip) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
        <h3 className="text-base font-bold text-slate-900 mb-2">Article Not Found</h3>
        <Link to="/care-tips" className="text-xs text-teal-600 font-semibold hover:underline">
          ← Return to Care Tips
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Back Link */}
      <Link
        to="/care-tips"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Care Tips Knowledge Base</span>
      </Link>

      {/* Main Article Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs space-y-6 p-6 sm:p-10">
        
        {/* Banner Image */}
        {tip.image && (
          <div className="h-64 sm:h-80 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-6 overflow-hidden relative">
            <img src={tip.image} alt={tip.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 sm:left-10 text-white space-y-1">
              <span className="px-3 py-1 bg-teal-600 text-xs font-bold rounded-lg uppercase">
                {tip.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">
                {tip.title}
              </h1>
            </div>
          </div>
        )}

        {!tip.image && (
          <div>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-lg uppercase">
              {tip.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {tip.title}
            </h1>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {tip.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              {tag}
            </span>
          ))}
          <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg flex items-center gap-1">
            <PawPrint className="w-3 h-3 text-teal-600" />
            Recommended Species: {tip.recommendedSpecies}
          </span>
        </div>

        {/* Article Content */}
        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 text-slate-700 whitespace-pre-line font-normal">
          {tip.detailedContent}
        </div>

        {/* Veterinary Notice */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs mt-8">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Recommendation:</strong> This guide is for general reference only. Always seek the advice of a qualified veterinarian regarding your pet's medical condition or treatment plan.
          </div>
        </div>
      </div>
    </div>
  );
};
