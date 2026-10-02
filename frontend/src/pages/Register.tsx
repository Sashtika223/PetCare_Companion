import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerFormSchema, RegisterInput } from '../validators/authSchema';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, Loader2, PawPrint, ArrowRight, ShieldCheck } from 'lucide-react';

export const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setServerError(null);
      setIsSubmitting(true);
      await registerUser(data);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again with another email.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Left Side: Brand Banner */}
        <div className="bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <PawPrint className="w-7 h-7 text-emerald-200" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Pet Care Companion</h1>
            </div>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              Join thousands of pet owners giving their pets the best care.
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed mb-8">
              Create your account to start managing pet profiles, medical history, vaccinations, daily logs, and vet appointments.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>100% Free & Secure Data Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>Instant Access to Pet Care Knowledge Base</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-500/30 text-xs text-emerald-200">
            © 2026 Pet Care Companion Platform
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Account ✨</h3>
            <p className="text-slate-500 text-sm">Fill in your details to get started.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder="Sarah Jenkins"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-teal-200 focus:border-teal-500'
                  } bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-4 transition-all`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="sarah@example.com"
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
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Min 6 characters"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-teal-200 focus:border-teal-500'
                  } bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-4 transition-all`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Repeat password"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.confirmPassword ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-teal-200 focus:border-teal-500'
                  } bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-4 transition-all`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
