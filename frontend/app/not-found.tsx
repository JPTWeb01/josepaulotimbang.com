import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-bold text-border mb-6 font-mono">404</p>
      <h1 className="text-2xl font-bold text-foreground mb-3">
        Page not found
      </h1>
      <p className="text-muted mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
