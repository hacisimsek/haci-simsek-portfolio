'use client';

import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const socialLinks = [
    {
      href: 'https://github.com/hacisimsek',
      label: 'GitHub',
      icon: (
        <FaGithub className="text-xl hover:text-gray-700 transition-colors duration-200" />
      ),
    },
    {
      href: 'https://linkedin.com/in/hacisimsek',
      label: 'LinkedIn',
      icon: (
        <FaLinkedin className="text-xl hover:text-blue-700 transition-colors duration-200" />
      ),
    },
    {
      href: 'https://x.com/CodeWithHaci',
      label: 'Twitter',
      icon: (
        <FaTwitter className="text-xl hover:text-blue-500 transition-colors duration-200" />
      ),
    },
  ];

  return (
    <footer
      className={`p-4 text-center fixed bottom-0 w-full bg-background transition-opacity duration-300 ${
        isVisible ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex justify-between items-center mx-auto max-w-4xl">
        <div className="text-left text-xs">
          <p>&copy; 2024 Haci Simsek. All rights reserved.</p>
          <p>Designed and developed by Haci Simsek.</p>
        </div>
        <div className="flex space-x-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
