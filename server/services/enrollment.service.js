import { supabaseAdmin } from '../config/supabaseClient.js';

/**
 * Enrolls a student in a course. Validates the course exists and is
 * published first (rather than letting a bad courseId surface as a
 * confusing FK violation), and turns the enrollments table's unique
 * constraint violation (student_id, course_id) into a clean 409
 * instead of a raw Postgres error bubbling up to the client.
 */
export async function enrollInCourse(studentId, courseId) {
    const { data: course, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('id, is_published')
        .eq('id', courseId)
        .single();

    if (courseError || !course) {
        const err = new Error('Course not found');
        err.status = 404;
        throw err;
    }

    if (!course.is_published) {
        const err = new Error('This course is not available for enrollment');
        err.status = 400;
        throw err;
    }

    const { data, error } = await supabaseAdmin
        .from('enrollments')
        .insert({ student_id: studentId, course_id: courseId, status: 'active' })
        .select()
        .single();

    if (error) {
        // Postgres unique_violation — the DB's uq_enrollments_student_course
        // constraint caught a duplicate enrollment attempt.
        if (error.code === '23505') {
            const err = new Error('You are already enrolled in this course');
            err.status = 409;
            throw err;
        }
        throw error;
    }

    return data;
}

/**
 * My Courses: every course the student is enrolled in, with enough
 * course/instructor detail to render a dashboard card without a
 * second round trip per course.
 */
export async function getMyCourses(studentId) {
    const { data, error } = await supabaseAdmin
        .from('enrollments')
        .select(
            `id, status, enrolled_at,
             course:courses(
               id, title, slug, thumbnail_url, level, language, price,
               instructor:users(id, first_name, last_name, avatar_url)
             )`
        )
        .eq('student_id', studentId)
        .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data;
}