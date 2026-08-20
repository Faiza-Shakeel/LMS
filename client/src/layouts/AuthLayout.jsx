import { Compass } from 'lucide-react';

/**
 * Split-screen layout shared by every auth page.
 *
 * Left panel: brand + a "learning path" motif — a dotted route connecting
 * four milestones (Enroll -> Learn -> Practice -> Certify). This stands in
 * for a generic illustration because it's literally what the product does,
 * and the same visual language reappears in the OTP boxes and password
 * strength meter elsewhere in this module.
 *
 * Right panel: the actual form content, passed in as children.
 *
 * Below the `lg` breakpoint the left panel is dropped entirely and replaced
 * with a compact header so the form is never fighting for space on mobile.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex bg-bg font-body">
      {/* Left panel — hidden below lg */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark">
        <div className="relative z-10 flex flex-col justify-between w-full px-14 py-12 text-white">
          <BrandMark variant="light" />

          <div className="max-w-md">
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">
              Learning that goes somewhere.
            </h1>
            <p className="mt-4 text-base text-white/70 leading-relaxed">
              Track every course from first enrollment to certificate, with a
              clear path forward at every step.
            </p>
          </div>

          <LearningPath />
        </div>

        {/* Ambient background texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Right panel — the form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="lg:hidden mb-6">
              <BrandMark variant="dark" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
            )}
          </div>

          {children}

          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

function BrandMark({ variant = 'dark' }) {
  const isLight = variant === 'light';
  return (
    <div className="flex items-center gap-2">
      <div
        className={
          isLight
            ? 'flex h-9 w-9 items-center justify-center rounded-lg bg-white/15'
            : 'flex h-9 w-9 items-center justify-center rounded-lg bg-primary'
        }
      >
        <Compass size={18} strokeWidth={2.25} className="text-white" />
      </div>
      <span
        className={
          isLight
            ? 'font-display text-lg font-semibold text-white'
            : 'font-display text-lg font-semibold text-ink'
        }
      >
        Pathwise
      </span>
    </div>
  );
}

function LearningPath() {
  const milestones = ['Enroll', 'Learn', 'Practice', 'Certify'];

  return (
    <div className="flex items-center" aria-hidden="true">
      {milestones.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-xs text-white/60">{label}</span>
          </div>
          {i < milestones.length - 1 && (
            <div className="mx-2 mb-5 h-px w-10 border-t border-dashed border-white/25" />
          )}
        </div>
      ))}
    </div>
  );
}