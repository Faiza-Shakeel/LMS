import * as enrollmentService from '../services/enrollment.service.js';

export async function enroll(req, res, next) {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ error: 'courseId is required' });
        }

        const enrollment = await enrollmentService.enrollInCourse(req.profile.id, courseId);

        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (err) {
        // Service throws errors with a .status for expected cases
        // (404 course not found, 400 unpublished, 409 already enrolled).
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
}

export async function getMyCourses(req, res, next) {
    try {
        const enrollments = await enrollmentService.getMyCourses(req.profile.id);
        res.status(200).json({ enrollments });
    } catch (err) {
        next(err);
    }
}