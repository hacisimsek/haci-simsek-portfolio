"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  name: string;
  description: string;
  html_url: string;
  updated_at: string;
}

const fetchProjectsData = async () => {
  const response = await fetch("https://api.github.com/users/hacisimsek/repos");
  const data = await response.json();
  return data.filter((project: Project) => project.description !== null)
             .sort((a: Project, b: Project) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
};

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 20000);

    const fetchProjects = async () => {
      try {
        const filteredData = await fetchProjectsData();
        setProjects(filteredData);
        clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section id="projects" className="mb-12">
      <h4 className="text-xl font-bold mb-4">Projects</h4>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : hasError ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-500">Oops! Bir sorun oluştu.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card key={index}>
              <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="block hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {project.description && project.description.length > 200
                      ? project.description.slice(0, 200) + "..."
                      : project.description}
                  </CardDescription>
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
