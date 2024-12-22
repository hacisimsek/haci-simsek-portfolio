'use client';

import { useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { ReactTyped } from 'react-typed';
import Link from 'next/link';

export default function Header() {
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        <Link href="/" >
          <ReactTyped
            strings={[
              "Haci Simsek",
              "Everytime Learner",
              "Passionate Java Dev.",
              "Software Eng. @SISAL",
              'Passionate Java Dev.',
              "Exploring AI",
            ]}
            typeSpeed={40}
            backSpeed={50}
            loop
          >
            <input type="text" />
          </ReactTyped>
        </Link>
      </h1>
      <nav className="hidden md:block">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-primary">
              About
            </Link>
          </li>
          <li>
            <Link href="/projects" className="hover:text-primary">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/articles" className="hover:text-primary">
              Articles
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Menu
        </button>
      </div>
      {isMenuOpen && (
        <nav className="absolute top-16 right-4 bg-background border border-border rounded-md shadow-lg md:hidden">
          <ul className="py-2">
            <li>
              <Link href="/" className="block px-4 py-2 hover:bg-accent">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="block px-4 py-2 hover:bg-accent"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className="block px-4 py-2 hover:bg-accent"
              >
                Articles
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block px-4 py-2 hover:bg-accent">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
