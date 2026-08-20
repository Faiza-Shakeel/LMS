import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import FormError from '../../components/ui/FormError';
import { emailPattern } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await login({ email: formData.email, password: formData.password });
      toast.success('Welcome back!');
      navigate('/courses');
    } catch (err) {
      setServerError(err.message || 'Invalid email or password');
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your courses."
      footer={
        <span className="text-ink-muted">
          Don&apos;t have an account?{' '}
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormError message={serverError} />

        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: emailPattern,
          })}
        />

        <div>
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                {...register('rememberMe')}
              />
              Remember me
            </label>

            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}