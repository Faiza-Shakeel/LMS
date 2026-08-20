import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Compass, LogOut, User } from 'lucide-react';
import  {useAuth } from '../context/AuthContext';

/**
 * NOTE: `user` in AuthContext is currently the raw Supabase auth object
 * (id, email, user_metadata) returned directly from login/signup — not
 * the richer public.users profile (first_name, last_name, role) your
 * backend's /auth/me endpoint returns. This layout reads name fields
 * from user_metadata as a reasonable stand-in for now. Once role-based
 * UI is needed (e.g. showing an "Instructor" nav item), AuthContext
 * should call /auth/me after login and store that profile instead.
 */
export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const firstName = user?.user_metadata?.first_name ?? '';
    const lastName = user?.user_metadata?.last_name ?? '';
    const email = user?.email ?? '';
    const initials = (firstName[0] ?? email[0] ?? '?').toUpperCase();

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors ${
            isActive ? 'text-primary' : 'text-ink-muted hover:text-ink'
        }`;

    return (
        <div className="min-h-screen bg-bg font-body">
            <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link to="/courses" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Compass size={16} className="text-white" />
                        </div>
                        <span className="font-display text-lg font-semibold text-ink">
                            Pathwise
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-8 sm:flex">
                        <NavLink to="/courses" className={navLinkClass} end>
                            Courses
                        </NavLink>
                        <NavLink to="/my-courses" className={navLinkClass}>
                            My Courses
                        </NavLink>
                    </nav>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Account menu"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                        >
                            {initials || <User size={16} />}
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-surface p-1.5 shadow-card">
                                <div className="px-3 py-2">
                                    <p className="truncate text-sm font-medium text-ink">
                                        {firstName} {lastName}
                                    </p>
                                    <p className="truncate text-xs text-ink-muted">{email}</p>
                                </div>
                                <div className="my-1 border-t border-border" />
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/5"
                                >
                                    <LogOut size={16} />
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}