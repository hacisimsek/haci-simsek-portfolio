import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Projects() {
  const projects = [
    { 
      title: "E-commerce Platform", 
      description: "A full-stack e-commerce solution using Java Spring Boot and Angular.",
      endPonint: "https://github.com/hacisimsek/springboot-microservice-app"
    },
    { 
      title: "Task Management App", 
      description: "A React-based task management application with a Java backend.",
      endPonint: "https://github.com/hacisimsek/task-management-app"
    },
    { 
      title: "Real-time Chat System", 
      description: "A scalable chat system using Java WebSockets and React for the frontend.",
      endPonint: "https://github.com/hacisimsek/real-time-chat-app"
    },
  ];

  return (
    <section id="projects" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={index}>
            <a href={project.endPonint} target="_blank">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{project.description}</CardDescription>
              </CardContent>
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}