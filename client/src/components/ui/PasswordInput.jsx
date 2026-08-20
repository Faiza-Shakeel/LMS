import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

/**
 * Password field with a show/hide toggle. Kept separate from Input rather
 * than an Input variant, since the trailing icon-button interaction and
 * type-switching state don't fit Input's plain-input contract.
 */
const PasswordInput = forwardRef(
  ({ label, error, className = '', ...rest }, ref) => {
    const id = useId();
    const [visible, setVisible] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <Lock
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />

          <input
            id={id}
            ref={ref}
            type={visible ? 'text' : 'password'}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-ink-faint
              transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
              ${error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}
              ${className}`}
            {...rest}
          />

          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink-muted"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;