# Haci Simsek Portfolio

A personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. The project is designed to present selected work, articles, and contact information through a fast, accessible, and production-oriented interface.

## Table of Contents

- Overview
- Features
- Tech Stack
- Project Structure
- Local Development
- Production Build and Preview
- Environment Variables
- Contributing
- License
- Contact

## Overview

This repository contains the source code for Haci Simsek's personal portfolio website. The project follows a component-based Next.js structure and is optimized for static export, performance, and maintainability.

## Features

- Next.js App Router setup
- TypeScript for type safety
- Tailwind CSS for styling
- Reusable component-driven UI
- Static export support
- Accessibility and performance-focused implementation

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Sonner and custom UI components

## Project Structure

Key directories:

- `app/` - Next.js application routes and layouts
- `components/` - Reusable UI components
- `public/` - Static assets such as images and icons
- `hooks/` and `lib/` - Shared utilities and custom hooks

## Local Development

Requirements:

- Node.js LTS
- npm

Install dependencies and start the development server:

```bash
git clone https://github.com/hacisimsek/haci-simsek-portfolio.git
cd haci-simsek-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

Available scripts:

- `npm run dev` - Start the development server
- `npm run build` - Create the production build and static export
- `npm run start` - Starts `next start`, which is not compatible with the current static export configuration
- `npm run format` - Format the codebase with Prettier
- `npm run lint` - Run linting

## Production Build and Preview

This project uses static export:

```bash
npm run build
```

The exported site is generated in the `out/` directory.

To preview the exported output locally, serve the `out/` directory with a static file server such as:

```bash
npx serve out
```

`npm run start` is not the correct production preview command for this repository because `next.config.js` uses `output: 'export'`.

## Environment Variables

This repository does not currently require a committed environment file. If a future feature needs secrets or private keys, store them in `.env.local` and keep that file out of version control.

## Contributing

Contributions are welcome for focused fixes and improvements. For larger changes, open an issue or discussion first to align on scope.

Recommended flow:

1. Create a branch from `main`
2. Make a focused change
3. Validate the change locally
4. Open a pull request

Additional repository workflow notes are documented in [AGENTS.md](AGENTS.md).

## License

No explicit license file is currently included in the repository. If the project is meant to be open source, add a `LICENSE` file and define the intended license clearly.

## Contact

Haci Simsek

- Website: [https://hacisimsek.com/](https://hacisimsek.com/)
- GitHub: [https://github.com/hacisimsek](https://github.com/hacisimsek)
- LinkedIn: [https://www.linkedin.com/in/haci-simsek/](https://www.linkedin.com/in/haci-simsek/)
