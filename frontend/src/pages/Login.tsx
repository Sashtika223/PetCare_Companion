import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginFormSchema, LoginInput } from '../validators/authSchema';
import { useAuth } from '../context/AuthContext';
import { Heart, Lock, Mail, Loader2, PawPrint, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setServerError(null);
      setIsSubmitting(true);
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Failed to sign in. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'demo@petcare.com');
    setValue('password', 'Password123!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Left Side: Brand Banner */}
        <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <PawPrint className="w-7 h-7 text-teal-200" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Pet Care Companion</h1>
            </div>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              Your pet's health, happiness & care in one place.
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed mb-8">
              Manage vaccinations, scheduled medications, veterinary appointments, daily walks, and health tips effortlessly.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-teal-100">
                <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0" />
                <span>Automated vaccination & appointment reminders</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-teal-100">
                <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0" />
                <span>Complete daily activity & health analytics</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-teal-100">
                <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0" />
                <span>Multi-pet profile management</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-teal-500/30 flex items-center gap-2 text-xs text-teal-200">
            <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
            <span>Built with care for pet owners worldwide</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back 👋</h3>
            <p className="text-slate-500 text-sm">Sign in to access your pet profiles and care dashboard.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-teal-200 focus:border-teal-500'
                  } bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-4 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-teal-200 focus:border-teal-500'
                  } bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-4 transition-all`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Auto-fill Demo Credentials (demo@petcare.com)</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
