import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {useAuth}  from '../context/AuthContext';

/**
 * Wraps any group of routes that require login. Nothing in the auth
 * module needed this (login/register are meant to be public), but every
 * page from here on — catalog, course details, my courses — does.
 *
 * Usage in App.jsx:
 *   <Route element={<RequireAuth />}>
 *     <Route element={<MainLayout />}>
 *       <Route path="/courses" element={<CourseCatalog />} />
 *     </Route>
 *   </Route>
 *
 * Preserves the attempted location in router state, so a login redirect
 * can send the user back to where they were headed instead of always
 * landing on a default page.
 */
export default function RequireAuth() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}