import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';

/**
 * Mounted at /auth/* in App.jsx. Kept as its own module so the auth
 * module's routes stay self-contained and easy to lazy-load later if
 * the app grows a dashboard/course-player route tree alongside it.
 */
export default function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}