import { supabaseAdmin } from '../config/supabaseClient.js';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

const SORT_OPTIONS = {
    newest: { column: 'created_at', ascending: false },
    oldest: { column: 'created_at', ascending: true },
    price_low: { column: 'price', ascending: true },
    price_high: { column: 'price', ascending: false },
};

/**
 * Get All Courses / Search / Filter, all in one query builder — these
 * three "features" are really the same endpoint with optional query
 * params layered on top of a base "published courses" query, not three
 * separate code paths.
 */
export async function getAllCourses({
    search,
    category,
    level,
    language,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
}) {
    const safeLimit = Math.min(Number(limit) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const safePage = Math.max(Number(page) || 1, 1);
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    let query = supabaseAdmin
        .from('courses')
        .select(
            `id, title, slug, description, thumbnail_url, level, language, price, created_at,
             instructor:users(id, first_name, last_name, avatar_url),
             category:categories(id, name)`,
            { count: 'exact' }
        )
        .eq('is_published', true);

    // Search: matches title OR description, case-insensitive.
    if (search) {
        const term = search.replace(/[%_]/g, '\\$&'); // escape ILIKE wildcards in user input
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }

    // Filters
    if (category) query = query.eq('category_id', category);
    if (level) query = query.eq('level', level);
    if (language) query = query.eq('language', language);
    if (minPrice !== undefined) query = query.gte('price', minPrice);
    if (maxPrice !== undefined) query = query.lte('price', maxPrice);

    const { column, ascending } = SORT_OPTIONS[sort] ?? SORT_OPTIONS.newest;
    query = query.order(column, { ascending }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
        courses: data,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total: count ?? 0,
            totalPages: count ? Math.ceil(count / safeLimit) : 0,
        },
    };
}

/**
 * Course Details: the published course itself, its instructor and
 * category, its section/lesson outline, and lightweight aggregates
 * (average rating, review count, enrollment count) computed on the fly.
 * Aggregates are cheap here because this only ever runs for ONE course
 * at a time — doing this in the list query above would mean N extra
 * queries per page of results, which is why list stays aggregate-free.
 */
export async function getCourseById(courseId) {
    const { data: course, error } = await supabaseAdmin
        .from('courses')
        .select(
            `*,
             instructor:users(id, first_name, last_name, avatar_url, bio),
             category:categories(id, name),
             sections(id, title, position,
               lessons(id, title, description, duration, is_preview, position)
             )`
        )
        .eq('id', courseId)
        .eq('is_published', true)
        .order('position', { referencedTable: 'sections', ascending: true })
        .order('position', { referencedTable: 'sections.lessons', ascending: true })
        .single();

    if (error || !course) return null;

    const { data: reviewRows } = await supabaseAdmin
        .from('reviews')
        .select('rating')
        .eq('course_id', courseId);

    const reviewCount = reviewRows?.length ?? 0;
    const averageRating = reviewCount
        ? reviewRows.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    const { count: enrollmentCount } = await supabaseAdmin
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', courseId)
        .eq('status', 'active');

    return {
        ...course,
        rating: { average: Number(averageRating.toFixed(2)), count: reviewCount },
        enrollmentCount: enrollmentCount ?? 0,
    };
}