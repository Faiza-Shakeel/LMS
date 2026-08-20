import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FormError from '../../components/ui/FormError';
import { emailPattern } from '../../utils/validators';
import * as authApi from '../../api/authApi';

export default function ForgotPassword() {
  const [serverError, setServerError] = useState('');
  const [sentTo, setSentTo] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await authApi.forgotPassword({ email: formData.email });
      setSentTo(formData.email);
    } catch (err) {
      setServerError(err.message || 'Could not send reset email. Please try again.');
    }
  };

  if (sentTo) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent password reset instructions."
      >
        <div className="rounded-xl border border-success/20 bg-success/5 px-4 py-4 text-center">
          <CheckCircle2 size={28} className="mx-auto mb-2 text-success" />
          <p className="text-sm text-ink">
            If an account exists for <span className="font-medium">{sentTo}</span>,
            a reset link is on its way. Check your inbox and spam folder.
          </p>
        </div>

        <div className="mt-6 text-center text-sm">
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <span className="text-ink-muted">
          Remembered it?{' '}
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
            Log in
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

        <Button type="submit" isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}