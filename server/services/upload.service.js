import cloudinary from '../config/cloudinary.js';

/**
 * Wraps Cloudinary's upload_stream (callback-based) in a Promise so
 * callers can await it. Streaming rather than writing the buffer to a
 * temp file first avoids any disk I/O for the upload entirely.
 */
function uploadBuffer(buffer, options) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        stream.end(buffer);
    });
}

export async function uploadThumbnailImage(buffer, { folder = 'lms/thumbnails' } = {}) {
    const result = await uploadBuffer(buffer, {
        folder,
        resource_type: 'image',
        // Normalizes every thumbnail to a consistent 16:9 card size
        // regardless of what the instructor originally uploaded.
        transformation: [{ width: 1280, height: 720, crop: 'fill' }],
    });

    return { url: result.secure_url, publicId: result.public_id };
}

export async function uploadLessonVideo(buffer, { folder = 'lms/videos' } = {}) {
    const result = await uploadBuffer(buffer, {
        folder,
        resource_type: 'video',
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
        // Cloudinary returns the video's actual duration — useful to
        // auto-fill lessons.duration instead of asking the instructor
        // to enter it manually.
        duration: result.duration ? Math.round(result.duration) : null,
    };
}

export async function deleteAsset(publicId, resourceType = 'image') {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}