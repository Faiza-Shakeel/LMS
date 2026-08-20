import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AuthRoutes from './routes/AuthRoutes';
import RequireAuth from './routes/RequireAuth';
import MainLayout from './layouts/MainLayout';
import CourseCatalog from './pages/student/CourseCatalog';
import CourseDetails from './pages/student/CourseDetails';
import MyCourses from './pages/student/MyCourses';
import Unauthorized from './pages/auth/Unauthorized';
import NotFound from './pages/auth/NotFound';

export default function App() {
  return (
    <div>

    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              borderRadius: '0.75rem',
            },
          }}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Everything below requires login. RequireAuth redirects to
              /auth/login (preserving the attempted location) if there's
              no authenticated user; MainLayout supplies the navbar shell
              every page here shares via <Outlet />. */}
          <Route element={<RequireAuth />}>
            <Route element={<MainLayout />}>
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/courses/:courseId" element={<CourseDetails />} />
              <Route path="/my-courses" element={<MyCourses />} />
            </Route>
          </Route>

          {/* Catch-all must stay last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
</div>
  );
}