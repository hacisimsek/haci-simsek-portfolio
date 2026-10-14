import Link from 'next/link';
import './globals.css';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <Link href="/" className="underline">
            Go to the home page
          </Link>
        </main>
      </body>
    </html>
  );
}
