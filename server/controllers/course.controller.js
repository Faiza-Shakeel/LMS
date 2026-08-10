import * as courseService from '../services/course.service.js';

export async function createCourse(req, res, next) {
    try {
        const { categoryId, title, slug, description, level } = req.body;

        if (!title || !slug) {
            return res.status(400).json({ error: 'title and slug are required' });
        }

        // instructor_id is taken from the authenticated user, never from the
        // request body — otherwise an instructor could create courses "owned"
        // by someone else.
        const course = await courseService.createCourse({
            instructorId: req.profile.id,
            categoryId,
            title,
            slug,
            description,
            level,
        });

        res.status(201).json({ course });
    } catch (err) {
        next(err);
    }
}

export async function listMyCourses(req, res, next) {
    try {
        const courses = await courseService.listCoursesForInstructor(req.profile.id);
        res.status(200).json({ courses });
    } catch (err) {
        next(err);
    }
}


/**
 * req.resource is already populated by the requireOwnership middleware —
 * by the time this runs, we know the caller is either the course's
 * instructor or an admin. No re-checking needed here.
 */
export async function updateCourse(req, res, next) {
    try {
        const allowedFields = ['title', 'description', 'category_id', 'level', 'price', 'is_published', 'thumbnail_url'];
        const updates = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
        );

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const course = await courseService.updateCourse(req.resource.id, updates);
        res.status(200).json({ course });
    } catch (err) {
        next(err);
    }
}

export async function deleteCourse(req, res, next) {
    try {
        await courseService.deleteCourse(req.resource.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export async function createSection(req, res, next) {
    try {
        const { title, position } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'title is required' });
        }

        const section = await courseService.createSection(req.resource.id, { title, position });
        res.status(201).json({ section });
    } catch (err) {
        next(err);
        console.error('Error creating section:', err);
    }
}

/**
 * Gated by requireEnrollment rather than requireOwnership: any of
 * admin / owning instructor / enrolled student can reach this.
 */
export async function getCourseContent(req, res) {
    res.status(200).json({
        message: `Access granted as ${req.profile.role}`,
        courseId: req.params.courseId,
    });
}