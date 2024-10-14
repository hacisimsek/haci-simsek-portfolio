import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Articles() {
  const articles = [
    { title: "Optimizing Java Performance", description: "Tips and tricks for improving Java application performance." },
    { title: "React Hooks Deep Dive", description: "An in-depth look at React Hooks and their use cases." },
    { title: "Microservices with Spring Boot", description: "Building scalable microservices architecture using Spring Boot." },
  ];

  return (
    <section id="articles" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{article.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}