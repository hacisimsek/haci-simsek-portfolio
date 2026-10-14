import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="fade-up space-y-6 pb-6">
      <div className="section-shell">
        <div className="mb-4 eyebrow">404</div>
        <h1 className="page-title">Page not found</h1>
        <p className="mt-5 page-subtitle">
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className="mt-6 inline-block underline">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
