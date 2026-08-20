import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center font-body">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <ShieldAlert size={30} className="text-danger" />
      </div>

      <p className="mt-6 font-display text-sm font-semibold uppercase tracking-wide text-danger">
        403 — Access denied
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
        You don&apos;t have permission to view this
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-muted">
        This page is restricted to a different account role. If you think
        this is a mistake, contact your administrator.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Go back
        </Button>
        <Link to="/auth/login" className="w-full">
          <Button className="w-full">Log in as different user</Button>
        </Link>
      </div>
    </div>
  );
}