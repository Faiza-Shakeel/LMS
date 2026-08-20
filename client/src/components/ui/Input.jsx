import { forwardRef, useId } from 'react';

/**
 * Generic labeled text input. Wrapped in forwardRef so React Hook Form's
 * register() can attach its ref directly: <Input {...register('email')} />
 */
const Input = forwardRef(
  ({ label, error, icon: Icon, type = 'text', className = '', ...rest }, ref) => {
    const id = useId();

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
          {Icon && (
            <Icon
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
          )}

          <input
            id={id}
            ref={ref}
            type={type}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint
              transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}
              ${className}`}
            {...rest}
          />
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

Input.displayName = 'Input';

export default Input;