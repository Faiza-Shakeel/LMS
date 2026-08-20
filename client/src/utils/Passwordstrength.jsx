/**
 * Scores a password from 0-4 based on length and character variety.
 * Returned as a level object rather than a raw number so the UI never
 * has to re-derive label/color from a score.
 */
const LEVELS = [
  { label: 'Very weak', color: 'bg-danger' },
  { label: 'Weak', color: 'bg-danger' },
  { label: 'Fair', color: 'bg-accent' },
  { label: 'Good', color: 'bg-accent' },
  { label: 'Strong', color: 'bg-success' },
];

export function getPasswordStrength(password = '') {
  if (!password) {
    return { score: 0, ...LEVELS[0] };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4);
  return { score: clamped, ...LEVELS[clamped] };
}