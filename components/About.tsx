import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <section id="about" className="mb-12">
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
          I am a passionate and skilled Software Engineer with dual degrees in Software Engineering and Electrical & Electronics Engineering from Bahcesehir University, where I graduated with a full scholarship. With a strong expertise in both Java and React, I specialize in building robust backend systems and dynamic frontend applications, offering a full-stack perspective that drives innovation and efficiency. Currently, I am working at SISAL, where I lead the end-to-end development of applications for an international audience. Dedicated to continuous growth, I actively contribute to the tech community by sharing insights and knowledge through professional articles.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}