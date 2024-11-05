import {
  Card,
  CardDescription,
  CardText,
} from "@/components/ui/card";

export default function Education() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">Education</h2>
      <div className="space-y-4">
        <Card>
          <div className="p-4">
            <div className="flex justify-between">
              <CardText>Bahçeşehir University - Istanbul, Turkey</CardText>
              <CardDescription> 2018 July — 2022 June</CardDescription>
            </div>
            <div className="mt-4">
              <CardDescription>
                Master's degree, Software Engineering
              </CardDescription>
            </div>
            <div className="border-b-4 text-muted-foreground mt-2" />
          </div>
          <div className="p-4">
            <div className="flex justify-between">
              <CardText>Bahçeşehir University - Istanbul, Turkey</CardText>
              <CardDescription> 2018 July — 2022 June</CardDescription>
            </div>
            <div className="mt-4">
              <CardDescription>
                Master's degree, Software Engineering
              </CardDescription>
            </div>
            <div className="border-b-4 text-muted-foreground mt-2" />
          </div>
          <div className="p-4">
            <div className="flex justify-between">
              <CardText>Bahçeşehir University - Istanbul, Turkey</CardText>
              <CardDescription> 2018 July — 2022 June</CardDescription>
            </div>
            <div className="mt-4">
              <CardDescription>
                Master's degree, Software Engineering
              </CardDescription>
            </div>
            <div className="border-b-4 text-muted-foreground mt-2" />
          </div>
        </Card>
      </div>
    </section>
  );
}
