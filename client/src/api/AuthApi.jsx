import axiosInstance from './axiosInstance';

export const login = (payload) =>
  axiosInstance.post('/auth/login', payload).then((res) => res.data);

export const register = (payload) =>
  axiosInstance.post('/auth/signup', payload).then((res) => res.data);

export const forgotPassword = (payload) =>
  axiosInstance.post('/auth/forgot-password', payload).then((res) => res.data);

export const resetPassword = (payload) =>
  axiosInstance.post('/auth/reset-password', payload).then((res) => res.data);

export const verifyOTP = (payload) =>
  axiosInstance.post('/auth/verify-otp', payload).then((res) => res.data);

export const resendOTP = (payload) =>
  axiosInstance.post('/auth/resend-otp', payload).then((res) => res.data);