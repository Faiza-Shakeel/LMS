import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Badge from '../ui/Badge';
import RatingStars from '../ui/RatingStars';

const LEVEL_LABELS = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

/**
 * Note: the catalog list endpoint deliberately doesn't return `rating`
 * (computing it per-course would mean N extra queries per page) — only
 * Course Details does. This card renders stars if `course.rating` is
 * present so it's forward-compatible if that changes later, but on the
 * catalog page that slot will just render empty.
 */
export default function CourseCard({ course }) {
    const instructorName = course.instructor
        ? `${course.instructor.first_name} ${course.instructor.last_name}`
        : 'Unknown instructor';

    return (
        <Link
            to={`/courses/${course.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow hover:shadow-lg"
        >
            <div className="aspect-video w-full overflow-hidden bg-primary/5">
                {course.thumbnail_url ? (
                    <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <BookOpen size={28} className="text-primary/30" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                    <Badge variant="primary">{LEVEL_LABELS[course.level] ?? course.level}</Badge>
                    {course.category?.name && <Badge variant="neutral">{course.category.name}</Badge>}
                </div>

                <h3 className="font-display text-base font-semibold leading-snug text-ink line-clamp-2">
                    {course.title}
                </h3>

                <p className="text-sm text-ink-muted">{instructorName}</p>

                <div className="mt-auto flex items-center justify-between pt-2">
                    {course.rating ? (
                        <RatingStars rating={course.rating.average} count={course.rating.count} />
                    ) : (
                        <span />
                    )}
                    <span className="font-display text-sm font-semibold text-ink">
                        {Number(course.price) > 0 ? `$${Number(course.price).toFixed(2)}` : 'Free'}
                    </span>
                </div>
            </div>
        </Link>
    );
}