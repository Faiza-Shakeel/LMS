import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import EnrolledCourseCard from '../../components/course/EnrolledCourseCard';
import Spinner from '../../components/ui/Spinner';
import * as enrollmentApi from '../../api/enrollmentApi';

export default function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await enrollmentApi.getMyCourses();
                setEnrollments(data.enrollments);
            } catch (err) {
                toast.error(err.message || 'Could not load your courses');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-semibold text-ink">My courses</h1>
                <p className="mt-1 text-sm text-ink-muted">
                    Everything you&apos;re currently enrolled in.
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Spinner size={28} className="text-primary" />
                </div>
            ) : enrollments.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                    <GraduationCap size={32} className="text-ink-faint" />
                    <p className="text-sm text-ink-muted">
                        You haven&apos;t enrolled in any courses yet.
                    </p>
                    <Link to="/courses" className="text-sm font-medium text-primary hover:underline">
                        Browse the catalog
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {enrollments.map((enrollment) => (
                        <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
                    ))}
                </div>
            )}
        </div>
    );
}