import { Star } from 'lucide-react';

/**
 * Rounds to the nearest half-star for display, but only shows the
 * numeric average (not a fake half-filled star icon) — five whole-star
 * icons colored by threshold is simpler to render correctly than
 * partial-fill SVGs, and the number next to it carries the precision.
 */
export default function RatingStars({ rating = 0, count, size = 14 }) {
    const rounded = Math.round(rating * 2) / 2;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                        key={i}
                        size={size}
                        className={i <= rounded ? 'fill-accent text-accent' : 'fill-transparent text-border'}
                    />
                ))}
            </div>
            {rating > 0 && <span className="text-xs font-medium text-ink">{rating.toFixed(1)}</span>}
            {count !== undefined && <span className="text-xs text-ink-muted">({count})</span>}
        </div>
    );
}