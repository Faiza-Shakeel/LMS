import * as catalogService from '../services/courseCatalog.service.js';

const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];
const VALID_SORTS = ['newest', 'oldest', 'price_low', 'price_high'];

export async function getAllCourses(req, res, next) {
    try {
        const { search, category, level, language, minPrice, maxPrice, sort, page, limit } = req.query;

        if (level && !VALID_LEVELS.includes(level)) {
            return res.status(400).json({ error: `level must be one of: ${VALID_LEVELS.join(', ')}` });
        }
        if (sort && !VALID_SORTS.includes(sort)) {
            return res.status(400).json({ error: `sort must be one of: ${VALID_SORTS.join(', ')}` });
        }
        if (minPrice !== undefined && Number.isNaN(Number(minPrice))) {
            return res.status(400).json({ error: 'minPrice must be a number' });
        }
        if (maxPrice !== undefined && Number.isNaN(Number(maxPrice))) {
            return res.status(400).json({ error: 'maxPrice must be a number' });
        }

        const result = await catalogService.getAllCourses({
            search,
            category,
            level,
            language,
            minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
            sort,
            page: page !== undefined ? Number(page) : undefined,
            limit: limit !== undefined ? Number(limit) : undefined,
        });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function getCourseDetails(req, res, next) {
    try {
        const course = await catalogService.getCourseById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({ course });
    } catch (err) {
        next(err);
    }
}