import { Search, SlidersHorizontal } from 'lucide-react';

const LEVELS = [
    { value: '', label: 'All levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
];

const SORTS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
];

/**
 * Controlled by the parent page: filters/onChange, not internal state,
 * so CourseCatalog owns the single source of truth it needs anyway to
 * build the API query params (and to reset pagination on filter change).
 *
 * No category filter yet — there's no categories list endpoint built on
 * the backend to populate it from. Add one here once that exists rather
 * than hardcoding category options that could drift from real data.
 */
export default function FilterBar({ filters, onChange }) {
    const update = (key, value) => onChange({ ...filters, [key]: value });

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                />
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => update('search', e.target.value)}
                    placeholder="Search courses..."
                    className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="hidden text-ink-faint sm:block" />

                <select
                    value={filters.level}
                    onChange={(e) => update('level', e.target.value)}
                    className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    {LEVELS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.sort}
                    onChange={(e) => update('sort', e.target.value)}
                    className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    {SORTS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}