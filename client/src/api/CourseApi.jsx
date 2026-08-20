import axiosInstance from './axiosInstance';

/**
 * params can include: search, category, level, language, minPrice,
 * maxPrice, sort, page, limit — all optional, matching the backend's
 * query-param-driven GET /courses endpoint (Get All / Search / Filter
 * are all handled server-side by one call, not three).
 */
export const getAllCourses = (params = {}) =>
    axiosInstance.get('/courses', { params }).then((res) => res.data);

export const getCourseById = (courseId) =>
    axiosInstance.get(`/courses/${courseId}`).then((res) => res.data);