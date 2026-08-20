/**
 * Plain surface container: white background, soft shadow, rounded corners.
 * Used for anything that needs to sit visually "above" the page background
 * outside of the auth form itself (e.g. an info box, a summary panel).
 */
export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}