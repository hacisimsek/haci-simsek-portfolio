import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="p-4 text-center fixed bottom-0 w-full bg-background">
      <div className="flex justify-between items-center mx-auto max-w-4xl">
        <div className="text-left text-xs">
          <p>&copy; 2024 Haci Simsek. All rights reserved.</p>
          <p>Designed and developed by Haci Simsek.</p>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://github.com/hacisimsek"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub className="text-xl hover:text-gray-700 transition-colors duration-200" />
          </a>
          <a
            href="https://linkedin.com/in/hacisimsek"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-xl hover:text-blue-700 transition-colors duration-200" />
          </a>
          <a
            href="https://x.com/CodeWithHaci"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter className="text-xl hover:text-blue-500 transition-colors duration-200" />
          </a>
        </div>
      </div>
    </footer>
  );
}
