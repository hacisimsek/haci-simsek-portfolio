import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Career() {
  const career = [
    {
      title: "Software Engineer - Sisal",
      description:
        "I'm part of the Lottery and Terminals team. I am actively using React.js and OSGI technologies in an end-to-end application. I also participate in many international travels and meetings.",
      endPoint: "",
    },
    {
      title: "Software Engineer - Nuevo Software House",
      description:
        "I was a member of the Sharepoint Team where we built end-to-end website applications. I actively used React.js and sharepoint technologies. I worked on these projects ; Turk petro , Avivasa, kordSA, Tavuk Dunyasi etc.",
      endPoint: "",
    },
    {
      title: "Software Engineer Intern - Sisal",
      description:
        "In the vas and messaging department, I made developments in Java using spring boot technology. The company is developing new technologies on 5G technologies.",
      endPoint: "",
    },
  ];

  return (
    <section id="career" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Career</h2>
      <div className="space-y-4">
        {career.map((career, index) => (
          <div key={index}>
            <Card>
              <CardHeader>
                <a href={career.endPoint} target="_blank">
                  <CardTitle>{career.title}</CardTitle>
                </a>
              </CardHeader>
              <CardContent>
                <CardDescription>{career.description}</CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
