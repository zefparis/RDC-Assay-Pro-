import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@rdcassay.africa',
      password: 'admin123',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);

    try {
      const response = await api.login(data.email, data.password);
      
      // Use auth hook to manage state
      login(response.token, response.user);
      
      // Close modal and reset form
      onClose();
      reset();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const requestAccess = async () => {
    try {
      const email = (getValues('email') || '').trim();
      if (!email) {
        toast.error('Veuillez saisir un email');
        return;
      }
      const res = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      toast.success('Demande envoyée. Nous vous contacterons par email.');
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la demande');
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Toaster />
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md"
          >
            <Card padding="lg" className="shadow-strong">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    {t.nav.login}
                  </h2>
                  <p className="text-sm text-secondary-600 mt-1">
                    Accédez à votre compte RDC Assay
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  icon={<X className="w-4 h-4" />}
                />
              </div>

              {/* Demo Credentials Info */}
              <div className="mb-6 p-3 rounded-lg bg-primary-50 border border-primary-200">
                <div className="text-sm text-primary-800">
                  <div className="font-medium mb-1">Identifiants de démonstration :</div>
                  <div className="font-mono text-xs">
                    Email: admin@rdcassay.africa<br />
                    Mot de passe: admin123
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="votre@email.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Mot de passe"
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-secondary-400 hover:text-secondary-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  Se connecter
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-secondary-200 text-center">
                <p className="text-sm text-secondary-600">
                  Pas encore de compte ?{' '}
                  <button onClick={requestAccess} className="text-primary-600 hover:text-primary-700 font-medium">
                    Contactez-nous
                  </button>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
