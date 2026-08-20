import Spinner from './Spinner';

const VARIANTS = {
  primary:
    'bg-primary text-black hover:bg-primary-dark disabled:hover:bg-primary',
  secondary:
    'bg-white text-ink border border-border hover:bg-bg disabled:hover:bg-white',
  ghost:
    'bg-transparent text-primary hover:bg-primary/5 disabled:hover:bg-transparent',
};

/**
 * Button with a built-in loading state. While `isLoading` is true, the
 * button is disabled and shows a Spinner in place of/alongside the label,
 * so callers never have to hand-manage disabled+spinner logic per form.
 */
export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5
        text-sm font-semibold transition-colors
        disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANTS[variant]}
        ${className}`}
      {...rest}
    >
      {isLoading && <Spinner size={16} />}
      {children}
    </button>
  );
}