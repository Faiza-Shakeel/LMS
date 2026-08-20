const VARIANTS = {
    neutral: 'bg-ink/5 text-ink-muted',
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${VARIANTS[variant]} ${className}`}
        >
            {children}
        </span>
    );
}