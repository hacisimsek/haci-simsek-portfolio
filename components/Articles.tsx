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
    },
    {
      title: "Centralized Service Registry",
      description:
        "The world of microservices is growing and evolving with each passing day. If we were to mention one of the bigge...",
    },
    {
      title: "Understanding Circuit Breaker Pattern in Microservices",
      description:
        "Imagine you are in an entertainment venue and sudden power surges threaten your systems. Fortunately, a small dev...",
    },
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
