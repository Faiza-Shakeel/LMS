import { AlertCircle } from 'lucide-react';

/**
 * Standalone error display, distinct from the inline error text built into
 * Input/PasswordInput. Used for form-level errors that don't belong to a
 * single field — e.g. "Invalid email or password" from a failed API call.
 * Renders nothing when there's no message, so it's always safe to mount.
 */
export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger"
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}