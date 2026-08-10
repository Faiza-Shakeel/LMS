import * as lessonService from '../services/lesson.service.js';

export async function createLesson(req, res, next) {
    try {
        const { title, description, videoUrl, duration, position, isPreview } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'title is required' });
        }

        // req.resource is the section row, attached by requireOwnership.
        const lesson = await lessonService.createLesson(req.resource.id, {
            title,
            description,
            videoUrl,
            duration,
            position,
            isPreview,
        });

        res.status(201).json({ lesson });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
}

export async function getLessons(req, res, next) {
    try {
        // req.resource.id is the section id, already verified to exist
        // and be owned by this instructor (or bypassed for admin) by
        // requireOwnership.
        const lessons = await lessonService.getLessonsBySection(req.resource.id);
        res.status(200).json({ lessons });
    } catch (err) {
        next(err);
    }
}

const FIELD_MAP = {
    title: 'title',
    description: 'description',
    videoUrl: 'video_url',
    duration: 'duration',
    position: 'position',
    isPreview: 'is_preview',
};

export async function updateLesson(req, res, next) {
    try {
        const updates = {};
        for (const [key, dbColumn] of Object.entries(FIELD_MAP)) {
            if (req.body[key] !== undefined) {
                updates[dbColumn] = req.body[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const lesson = await lessonService.updateLesson(req.resource.id, updates);
        res.status(200).json({ lesson });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
}

export async function deleteLesson(req, res, next) {
    try {
        await lessonService.deleteLesson(req.resource.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}