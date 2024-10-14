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
            I'm a passionate Java and React developer with extensive experience in building robust backend systems and dynamic frontend applications. With a strong foundation in both technologies, I bring a unique perspective to full-stack development.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}