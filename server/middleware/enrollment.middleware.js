import { supabaseAdmin } from '../config/supabaseClient.js';

/**
 * Guards course-content routes (lessons, quizzes, progress, etc.) so that:
 *   - admins always get access
 *   - instructors get access only if they own the course
 *   - students get access only if they have an enrollment row for it
 *
 * This is a different shape from requireOwnership because "who's allowed
 * in" here isn't one owner column — it's role-dependent (own vs. enrolled).
 * Must run after verifyToken.
 */
export function requireEnrollment({ courseIdParam = 'courseId' } = {}) {
    return async (req, res, next) => {
        try {
            const courseId = req.params[courseIdParam];

            if (!courseId) {
                return res.status(400).json({ error: `Missing ${courseIdParam} in request params` });
            }

            if (req.profile.role === 'admin') {
                return next();
            }

            if (req.profile.role === 'instructor') {
                const { data: course, error } = await supabaseAdmin
                    .from('courses')
                    .select('id, instructor_id')
                    .eq('id', courseId)
                    .single();

                if (error || !course) {
                    return res.status(404).json({ error: 'Course not found' });
                }
                if (course.instructor_id !== req.profile.id) {
                    return res.status(403).json({ error: 'You do not have access to this course' });
                }
                req.course = course;
                return next();
            }

            // student
            const { data: enrollment, error } = await supabaseAdmin
                .from('enrollments')
                .select('id, status')
                .eq('course_id', courseId)
                .eq('student_id', req.profile.id)
                .maybeSingle();

            if (error) throw error;

            if (!enrollment || enrollment.status !== 'active') {
                return res.status(403).json({ error: 'You must be enrolled in this course to access it' });
            }

            req.enrollment = enrollment;
            next();
        } catch (err) {
            next(err);
        }
    };
}