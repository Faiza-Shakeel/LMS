import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
    );

    return (
        <div className="flex items-center justify-center gap-1.5">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map((p, i) => {
                const prev = pages[i - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                    <div key={p} className="flex items-center gap-1.5">
                        {showEllipsis && <span className="px-1 text-ink-faint">...</span>}
                        <button
                            onClick={() => onPageChange(p)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                p === page ? 'bg-primary text-white' : 'text-ink-muted hover:bg-bg'
                            }`}
                        >
                            {p}
                        </button>
                    </div>
                );
            })}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}