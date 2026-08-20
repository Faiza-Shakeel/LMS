import { getPasswordStrength } from '../../utils/passwordStrength';

/**
 * Four-segment strength bar. Deliberately echoes the dotted milestone
 * path in AuthLayout (four stages, filled left-to-right) so the same
 * "progress" visual language shows up here too, rather than a generic
 * unrelated progress bar.
 */
export default function PasswordStrengthMeter({ password }) {
  const { score, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < score ? color : 'bg-border'
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-muted">{label}</p>
    </div>
  );
}