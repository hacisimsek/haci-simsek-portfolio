import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Education() {
  return (
    <section id="education" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Education</h2>
      <div className="space-y-4">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bahcesehir University</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Bachelor's Degree, Software Engineering
              </CardDescription>
              <CardDescription>
                Bachelor's Degree, Electrical & Electronics Engineering
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
