import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import OTPInput from '../../components/ui/OTPInput';
import Button from '../../components/ui/Button';
import FormError from '../../components/ui/FormError';
import * as authApi from '../../api/authApi';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [serverError, setServerError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = useCallback(
    async (code) => {
      setServerError('');
      setIsVerifying(true);
      try {
        await authApi.verifyOTP({ email, otp: code });
        toast.success('Email verified!');
        navigate('/auth/login');
      } catch (err) {
        setServerError(err.message || 'Invalid or expired code. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    },
    [email, navigate]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setServerError(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }
    handleVerify(otp);
  };

  const handleResend = async () => {
    setServerError('');
    setIsResending(true);
    try {
      await authApi.resendOTP({ email });
      toast.success('A new code has been sent.');
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setOtp('');
    } catch (err) {
      setServerError(err.message || 'Could not resend the code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email
          ? `Enter the 6-digit code we sent to ${email}`
          : 'Enter the 6-digit code we sent to your email.'
      }
      footer={
        <span className="text-ink-muted">
          Wrong email?{' '}
          <Link to="/auth/register" className="font-medium text-primary hover:underline">
            Go back
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormError message={serverError} />

        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck size={22} className="text-primary" />
          </div>
        </div>

        <OTPInput length={OTP_LENGTH} value={otp} onChange={setOtp} />

        <Button type="submit" isLoading={isVerifying}>
          Verify email
        </Button>

        <div className="text-center text-sm text-ink-muted">
          {secondsLeft > 0 ? (
            <span>
              Resend code in{' '}
              <span className="font-medium text-ink tabular-nums">
                0:{String(secondsLeft).padStart(2, '0')}
              </span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? 'Resending...' : 'Resend code'}
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
}