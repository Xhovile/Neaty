import React, { useState } from 'react';
import { LogIn, GraduationCap, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType } from '../../domain/school/types';
import { signInWithPassword } from '../../integrations/supabase/auth-service';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { session } = await signInWithPassword(email.trim(), password);
      if (!session) {
        throw new Error('No active session was returned.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in right now.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-blue-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Neaty</h1>
          <p className="text-blue-100 mt-1 text-sm">School Report Management System</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  placeholder="you@school.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Use your assigned Neaty account to access your school workspace.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
