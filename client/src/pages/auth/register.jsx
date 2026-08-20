import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, GraduationCap, Presentation } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import PasswordStrengthMeter from '../../components/ui/PasswordStrengthMeter';
import Button from '../../components/ui/Button';
import FormError from '../../components/ui/FormError';
import { emailPattern, passwordMinLength, nameMaxLength } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'instructor', label: 'Instructor', icon: Presentation },
];

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: { role: 'student' },
  });

  const password = watch('password', '');
  const selectedRole = watch('role');

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      const data = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast.success('Account created!');

      // No session yet means email confirmation is required first.
      navigate(data.session ? '/courses' : '/auth/verify-email', {
        state: { email: formData.email },
      });
    } catch (err) {
      setServerError(err.message || 'Could not create your account. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start learning or start teaching."
      footer={
        <span className="text-ink-muted">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormError message={serverError} />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            icon={User}
            placeholder="Ada"
            error={errors.firstName?.message}
            {...register('firstName', {
              required: 'Required',
              maxLength: nameMaxLength,
            })}
          />
          <Input
            label="Last name"
            icon={User}
            placeholder="Lovelace"
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Required',
              maxLength: nameMaxLength,
            })}
          />
        </div>

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
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: passwordMinLength,
            })}
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">I am a</span>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, label, icon: Icon }) => {
              const isSelected = selectedRole === value;
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors
                    ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-ink-muted hover:border-ink-faint'
                    }`}
                >
                  <input
                    type="radio"
                    value={value}
                    className="sr-only"
                    {...register('role', { required: true })}
                  />
                  <Icon size={18} />
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        <Button type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}