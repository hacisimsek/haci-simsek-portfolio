"use client"

import { useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { setTheme, theme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Haci Simsek</h1>
      <nav className="hidden md:block">
        <ul className="flex space-x-4">
          <li><a href="#about" className="hover:text-primary">About</a></li>
          <li><a href="#projects" className="hover:text-primary">Projects</a></li>
          <li><a href="#articles" className="hover:text-primary">Articles</a></li>
          <li><a href="#contact" className="hover:text-primary">Contact</a></li>
        </ul>
      </nav>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
            <li><a href="#about" className="block px-4 py-2 hover:bg-accent">About</a></li>
            <li><a href="#projects" className="block px-4 py-2 hover:bg-accent">Projects</a></li>
            <li><a href="#articles" className="block px-4 py-2 hover:bg-accent">Articles</a></li>
            <li><a href="#contact" className="block px-4 py-2 hover:bg-accent">Contact</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
}