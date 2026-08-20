import { useState, useEffect, useCallback } from 'react';
import { SearchX } from 'lucide-react';
import toast from 'react-hot-toast';
import CourseCard from '../../components/course/CourseCard';
import FilterBar from '../../components/course/FilterBar';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import useDebounce from '../../hooks/useDebounce';
import * as courseApi from '../../api/courseApi';

const DEFAULT_FILTERS = { search: '', level: '', sort: 'newest' };
const PAGE_SIZE = 12;

export default function CourseCatalog() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);
    const [courses, setCourses] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Search is debounced; level/sort take effect immediately since
    // they're discrete choices, not free text that changes per keystroke.
    const debouncedSearch = useDebounce(filters.search, 400);

    // Any filter change should reset back to page 1 — staying on page 4
    // of a now-different result set would just show an empty/wrong page.
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filters.level, filters.sort]);

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await courseApi.getAllCourses({
                search: debouncedSearch || undefined,
                level: filters.level || undefined,
                sort: filters.sort,
                page,
                limit: PAGE_SIZE,
            });
            setCourses(data.courses);
            setPagination(data.pagination);
        } catch (err) {
            toast.error(err.message || 'Could not load courses');
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, filters.level, filters.sort, page]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-semibold text-ink">Explore courses</h1>
                <p className="mt-1 text-sm text-ink-muted">
                    Find your next course from our full catalog.
                </p>
            </div>

            <FilterBar filters={filters} onChange={setFilters} />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Spinner size={28} className="text-primary" />
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                    <SearchX size={32} className="text-ink-faint" />
                    <p className="text-sm text-ink-muted">No courses match your search.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}