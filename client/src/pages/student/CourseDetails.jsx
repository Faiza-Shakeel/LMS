import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Users, Globe, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import RatingStars from '../../components/ui/RatingStars';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import CurriculumAccordion from '../../components/course/CurriculumAccordion';
import * as courseApi from '../../api/courseApi';
import * as enrollmentApi from '../../api/enrollmentApi';

const LEVEL_LABELS = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

export default function CourseDetails() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const fetchCourse = useCallback(async () => {
        setIsLoading(true);
        setNotFound(false);
        try {
            const data = await courseApi.getCourseById(courseId);
            setCourse(data.course);
        } catch (err) {
            if (err.response?.status === 404) {
                setNotFound(true);
            } else {
                toast.error(err.message || 'Could not load this course');
            }
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const handleEnroll = async () => {
        setIsEnrolling(true);
        try {
            await enrollmentApi.enrollInCourse(courseId);
            toast.success('Enrolled successfully!');
            setIsEnrolled(true);
        } catch (err) {
            // 409 means the backend's uq_enrollments_student_course
            // constraint caught a duplicate — not really a failure from
            // the student's point of view, just "you're already in".
            if (err.response?.status === 409) {
                toast('You are already enrolled in this course', { icon: 'ℹ️' });
                setIsEnrolled(true);
            } else {
                toast.error(err.message || 'Could not enroll. Please try again.');
            }
        } finally {
            setIsEnrolling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-24">
                <Spinner size={28} className="text-primary" />
            </div>
        );
    }

    if (notFound || !course) {
        return (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
                <BookOpen size={32} className="text-ink-faint" />
                <p className="text-sm text-ink-muted">This course couldn&apos;t be found.</p>
                <Link to="/courses" className="text-sm font-medium text-primary hover:underline">
                    Back to catalog
                </Link>
            </div>
        );
    }

    const instructorName = course.instructor
        ? `${course.instructor.first_name} ${course.instructor.last_name}`
        : 'Unknown instructor';

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <Badge variant="primary">{LEVEL_LABELS[course.level] ?? course.level}</Badge>
                        {course.category?.name && <Badge variant="neutral">{course.category.name}</Badge>}
                    </div>

                    <h1 className="font-display text-3xl font-semibold leading-tight text-ink">
                        {course.title}
                    </h1>

                    {course.description && (
                        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                            {course.description}
                        </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
                        <RatingStars
                            rating={course.rating?.average ?? 0}
                            count={course.rating?.count ?? 0}
                        />
                        <span className="flex items-center gap-1.5">
                            <Users size={15} />
                            {course.enrollmentCount} students
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Globe size={15} />
                            {course.language}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BarChart3 size={15} />
                            {LEVEL_LABELS[course.level] ?? course.level}
                        </span>
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 font-display text-lg font-semibold text-ink">Curriculum</h2>
                    <CurriculumAccordion sections={course.sections} />
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-card">
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-primary/5">
                        {course.thumbnail_url ? (
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

                    <p className="font-display text-2xl font-semibold text-ink">
                        {Number(course.price) > 0 ? `$${Number(course.price).toFixed(2)}` : 'Free'}
                    </p>

                    {isEnrolled ? (
                        <Link to="/my-courses">
                            <Button className="w-full">Go to My Courses</Button>
                        </Link>
                    ) : (
                        <Button className="w-full" isLoading={isEnrolling} onClick={handleEnroll}>
                            Enroll now
                        </Button>
                    )}

                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                            Instructor
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                {course.instructor?.avatar_url ? (
                                    <img
                                        src={course.instructor.avatar_url}
                                        alt={instructorName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    instructorName.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-ink">{instructorName}</p>
                                {course.instructor?.bio && (
                                    <p className="line-clamp-2 text-xs text-ink-muted">
                                        {course.instructor.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}