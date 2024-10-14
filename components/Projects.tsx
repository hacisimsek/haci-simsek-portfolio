import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Projects() {
  const projects = [
    { title: "E-commerce Platform", description: "A full-stack e-commerce solution using Java Spring Boot and React." },
    { title: "Task Management App", description: "A React-based task management application with a Java backend." },
    { title: "Real-time Chat System", description: "A scalable chat system using Java WebSockets and React for the frontend." },
  ];

  return (
    <section id="projects" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}