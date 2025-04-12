import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <h1 className="text-4xl font-bold mb-4 text-white">404 - Page Not Found</h1>
      <p className="text-lg mb-6 text-white">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">
        <a className="text-blue-300 hover:underline">Go back to Home</a>
      </Link>
    </div>
  );
}