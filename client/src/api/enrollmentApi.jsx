import axiosInstance from './axiosInstance';

export const enrollInCourse = (courseId) =>
    axiosInstance.post('/enrollments', { courseId }).then((res) => res.data);

export const getMyCourses = () =>
    axiosInstance.get('/enrollments/my-courses').then((res) => res.data);