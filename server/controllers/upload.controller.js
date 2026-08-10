import * as uploadService from '../services/upload.service.js';
import * as courseService from '../services/course.service.js';
import * as lessonService from '../services/lesson.service.js';

export async function uploadCourseThumbnail(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No thumbnail file provided (field name: thumbnail)' });
        }

        const { url } = await uploadService.uploadThumbnailImage(req.file.buffer);

        // req.resource is the course row, already verified as owned by
        // this instructor (or bypassed for admin) by requireOwnership.
        const course = await courseService.updateCourse(req.resource.id, { thumbnail_url: url });

        res.status(200).json({ course });
    } catch (err) {
        next(err);
    }
}

export async function uploadLessonVideoFile(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided (field name: video)' });
        }

        const { url, duration } = await uploadService.uploadLessonVideo(req.file.buffer);

        const updates = { video_url: url };
        if (duration) updates.duration = duration; // auto-fill from Cloudinary's metadata

        const lesson = await lessonService.updateLesson(req.resource.id, updates);

        res.status(200).json({ lesson });
    } catch (err) {
        next(err);
    }
}