import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordInput from '../../components/ui/PasswordInput';
import PasswordStrengthMeter from '../../components/ui/PasswordStrengthMeter';
import Button from '../../components/ui/Button';
import FormError from '../../components/ui/FormError';
import { passwordMinLength } from '../../utils/validators';
import * as authApi from '../../api/authApi';

/**
 * Supabase's password recovery email delivers the access token in the
 * URL FRAGMENT (#access_token=...&type=recovery), not the query string
 * (?token=...) — the two are parsed completely differently, and a
 * fragment is never even sent to a server, so it has to be read
 * client-side from window.location.hash.
 *
 * If Supabase rejected the link itself (already used, expired), it
 * redirects here with #error=...&error_code=...&error_description=...
 * instead — that case is surfaced immediately as its own page state,
 * rather than only failing after the user fills out the form and hits
 * submit.
 */
function parseHashParams() {
  const raw = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(raw);
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [linkError, setLinkError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const params = parseHashParams();
    const errorDescription = params.get('error_description');
    const token = params.get('access_token');
    const type = params.get('type');

    if (errorDescription) {
      setLinkError(errorDescription.replace(/\+/g, ' '));
    } else if (token && type === 'recovery') {
      setAccessToken(token);
    } else {
      setLinkError('This reset link is invalid or has expired.');
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const password = watch('password', '');

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await authApi.resetPassword({ token: accessToken, password: formData.password });
      toast.success('Password updated. Please log in.');
      navigate('/auth/login');
    } catch (err) {
      setServerError(err.message || 'Could not reset your password. The link may have expired.');
    }
  };

  if (linkError) {
    return (
      <AuthLayout
        title="Link expired"
        subtitle="This password reset link can no longer be used."
      >
        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-4 text-center">
          <AlertTriangle size={28} className="mx-auto mb-2 text-danger" />
          <p className="text-sm text-ink">{linkError}</p>
        </div>
        <div className="mt-6 text-center text-sm">
          <Link to="/auth/forgot-password" className="font-medium text-primary hover:underline">
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Brief flash while the hash is parsed on mount — avoids rendering
  // the form for an instant before we know whether the link is valid.
  if (!accessToken) return null;

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <span className="text-ink-muted">
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormError message={serverError} />

        <div>
          <PasswordInput
            label="New password"
            placeholder="Create a new password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: passwordMinLength,
            })}
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <PasswordInput
          label="Confirm new password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}