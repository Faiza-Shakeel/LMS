import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center font-body">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Compass size={30} className="text-primary" />
      </div>

      <p className="mt-6 font-display text-sm font-semibold uppercase tracking-wide text-primary">
        404 — Page not found
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
        Looks like this path doesn&apos;t exist
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-muted">
        The page you're looking for may have been moved or never existed.
        Let's get you back on track.
      </p>

      <Link to="/" className="mt-8 w-full max-w-xs">
        <Button className="w-full">Back to home</Button>
      </Link>
    </div>
  );
}