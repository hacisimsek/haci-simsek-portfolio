"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);

  const projects = [
    { 
      title: "Timeless Talk App", 
      description: "An AI-powered chat application! Built using modern JavaScript technologies like React, this app allows users to interact with famous historical figures. Leveraging various generative AI APIs, it delivers realistic and educational conversation experiences.",
      endpoint: "https://github.com/hacisimsek/timeless-talks"
    },
    { 
      title: "E-commerce Platform", 
      description: "A full-stack e-commerce solution using Java Spring Boot and Angular.",
      endpoint: "https://github.com/hacisimsek/springboot-microservice-app"
    },
    { 
      title: "Task Management App", 
      description: "A React-based task management application with a Java backend.",
      endpoint: "https://github.com/hacisimsek/task-management-app"
    },
    { 
      title: "Real-time Chat System", 
      description: "A scalable chat system using Java WebSockets and React for the frontend.",
      endpoint: "https://github.com/hacisimsek/real-time-chat-app"
    },
    { 
      title: "Personal Portfolio", 
      description: "A personal portfolio built with modern technologies like Next.js, showcasing projects, skills, and accomplishments in software development. Designed for a clean and engaging user experience.",
      endpoint: "https://github.com/hacisimsek/haci-simsek-portfolio"
    },
    { 
      title: "Java-Spring", 
      description: "A collection of Java and Spring projects, including RESTful services, data processing, and microservices architecture. Perfect for those exploring the Java-Spring ecosystem.",
      endpoint: "https://github.com/hacisimsek/Java-Spring"
    },
    {
      title: "Strangler Fig Pattern",
      description: "This repository showcases the Strangler Fig Pattern for transitioning legacy code to modern code incrementally, allowing for new features alongside existing ones. Includes examples, refactoring steps, and guidelines for a smooth migration.",
      endpoint: "https://github.com/hacisimsek/strangler-fig-pattern"
    },
    {
      title: "Circuit Breaker Pattern",
      description: "Developed and enhanced a custom Circuit Breaker pattern, moving beyond the conventional three-part module structure for improved functionality.",
      endpoint: "https://github.com/hacisimsek/circuit-breaker-pattern"
    },
    {
      title: "BFF Pattern",
      description: "Implemented the Backend for Frontend (BFF) pattern in this microservices project for optimized client-server interactions.",
      endpoint: "https://github.com/hacisimsek/bff-application"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulating data fetching
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="projects" className="mb-12">
      <h4 className="text-xl font-bold mb-4">Projects</h4>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card key={index}>
              <a href={project.endpoint} target="_blank" rel="noopener noreferrer" className="block hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {project.description.length > 200
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
