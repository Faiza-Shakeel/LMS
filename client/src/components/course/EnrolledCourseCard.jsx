import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Badge from '../ui/Badge';

const STATUS_VARIANTS = {
    active: 'primary',
    completed: 'success',
    cancelled: 'neutral',
    expired: 'neutral',
};

const STATUS_LABELS = {
    active: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired',
};

export default function EnrolledCourseCard({ enrollment }) {
    const { course, status, enrolled_at } = enrollment;

    const instructorName = course?.instructor
        ? `${course.instructor.first_name} ${course.instructor.last_name}`
        : 'Unknown instructor';

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="aspect-video w-full overflow-hidden bg-primary/5">
                {course?.thumbnail_url ? (
                    <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <BookOpen size={28} className="text-primary/30" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <Badge variant={STATUS_VARIANTS[status] ?? 'neutral'}>
                    {STATUS_LABELS[status] ?? status}
                </Badge>

                <h3 className="font-display text-base font-semibold leading-snug text-ink line-clamp-2">
                    {course?.title ?? 'Untitled course'}
                </h3>

                <p className="text-sm text-ink-muted">{instructorName}</p>

                <p className="text-xs text-ink-faint">
                    Enrolled {new Date(enrolled_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </p>

                <Link
                    to={`/courses/${course?.id}`}
                    className="mt-auto pt-2 text-sm font-medium text-primary hover:underline"
                >
                    Continue learning →
                </Link>
            </div>
        </div>
    );
}