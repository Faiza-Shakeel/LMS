import { useRef } from 'react';

/**
 * Controlled OTP input: parent owns the value as a single string via
 * `value`/`onChange`, this component just handles the per-box UX
 * (auto-advance on type, auto-retreat on backspace, full-code paste).
 */
export default function OTPInput({ length = 6, value, onChange, error }) {
  const inputsRef = useRef([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const setDigit = (index, digit) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(''));
  };

  const handleChange = (index, rawValue) => {
    const digit = rawValue.replace(/\D/g, '').slice(-1);
    setDigit(index, digit);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    onChange(pasted.padEnd(length, '').slice(0, length).trimEnd());
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div>
      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={`h-12 w-11 rounded-xl border bg-white text-center font-display text-lg font-semibold text-ink
              tabular-nums transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
              ${error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}