import multer from 'multer';

// Memory storage, not disk: the file buffer goes straight to Cloudinary's
// upload stream (see services/upload.service.js) with nothing written to
// disk in between — no temp files to clean up, nothing left behind if the
// process crashes mid-upload.
const storage = multer.memoryStorage();

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

function fileFilter(allowedTypes, label) {
    return (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type. Allowed ${label} types: ${allowedTypes.join(', ')}`));
        }
        cb(null, true);
    };
}

export const uploadThumbnail = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: fileFilter(IMAGE_MIME_TYPES, 'image'),
}).single('thumbnail');

export const uploadVideo = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
    fileFilter: fileFilter(VIDEO_MIME_TYPES, 'video'),
}).single('video');

/**
 * Must be placed immediately after uploadThumbnail/uploadVideo in a
 * route's middleware chain. Multer forwards file-type/size errors via
 * next(err), which skips straight past any middleware in between and
 * lands here — turning a raw MulterError into a clean 400 instead of
 * falling through to the generic 500 handler.
 */
export function handleUploadError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File is too large.' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
}