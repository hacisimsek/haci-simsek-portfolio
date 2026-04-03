'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Clock3, FolderGit2 } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  html_url: string;
  updated_at: string;
  language?: string;
}

async function fetchProjectsData() {
  const response = await fetch('https://api.github.com/users/hacisimsek/repos');
  const data = await response.json();

  return data
    .filter((project: Project) => project.description !== null)
    .sort(
      (a: Project, b: Project) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
}

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 20000);

    async function fetchProjects() {
      try {
        const filteredData = await fetchProjectsData();
        setProjects(filteredData);
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className="space-y-6 pb-6 fade-up">
      <div className="section-shell">
        <div className="eyebrow mb-4">Projects</div>
        <h1 className="page-title">Selected builds, experiments, and engineering curiosities</h1>
        <p className="mt-5 page-subtitle">
          A live pull from GitHub that reflects how I build in the open. The
          focus is not just code volume, but the patterns, ideas, and product
          instincts behind each repo.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="surface-card h-64 animate-pulse bg-card/70"
            />
          ))}
        </div>
      ) : hasError ? (
        <div className="section-shell">
          <p className="text-base text-destructive">
            Project feed could not be loaded right now.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try again in a moment or visit the GitHub profile directly.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.html_url}
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group surface-card flex min-h-[18rem] flex-col p-6 transition hover:-translate-y-1 hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-foreground" />
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {project.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {project.description.length > 180
                    ? `${project.description.slice(0, 180)}...`
                    : project.description}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                {project.language ? (
                  <span className="meta-chip">{project.language}</span>
                ) : null}
                <span className="meta-chip">
                  <Clock3 className="mr-2 h-3.5 w-3.5" />
                  {new Date(project.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
