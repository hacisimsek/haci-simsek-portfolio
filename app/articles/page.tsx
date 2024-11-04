import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export default function Articles() {
    const articles = [
      {
        title: "Strangler Fig Pattern",
        description:
          "In today’s software world, there are many large, monolithic software projects. These projects can be hard to kee...",
        endPoint:
          "https://medium.com/@hacisimsek/strangler-fig-pattern-742f2f52f297",
      },
      {
        title: "Centralized Service Registry",
        description:
          "The world of microservices is growing and evolving with each passing day. If we were to mention one of the bigge...",
        endPoint:
          "https://medium.com/@hacisimsek/centralized-service-registry-15ea87b38d71",
      },
      {
        title: "Understanding Circuit Breaker Pattern in Microservices",
        description:
          "Imagine you are in an entertainment venue and sudden power surges threaten your systems. Fortunately, a small dev...",
        endPoint:
          "https://medium.com/@hacisimsek/what-is-the-circuit-breaker-pattern-and-why-is-it-important-for-microservice-architecture-6c997be77949",
      },
    ];
  
    return (
      <section id="articles" className="mb-12">
        <h4 className="text-xl font-bold mb-4">Latest Articles</h4>
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div key={index}>
              <a href={article.endPoint} target="_blank" className="mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{article.description}</CardDescription>
                  </CardContent>
                </Card>
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  }
  