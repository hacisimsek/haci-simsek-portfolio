import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Bold from "@/components/ui/bold";
import { split } from "postcss/lib/list";

export default function Career() {
  const career = [
    {
      title: "Software Engineer - Sisal",
      description:[
        "Currently a key member of the Lottery and Terminals team, focusing on end-to-end application development using <Bold>React.js<Bold> and <Bold>OSGi technologies<Bold>.",
        "Collaborate on global projects, actively participating in international meetings and business trips to contribute to strategic discussions and decision-making processes.",
        "Play a vital role in the design, development, and optimization of scalable software solutions for the lottery and gaming industry.",
        "Lead the design and implementation of the Orion module, introducing a secure authentication infrastructure for our full-stack application."
      ],
      endPoint: "",
    },
    {
      title: "Software Engineer - Nuevo Software House",
      description:[
        "Collaborated as a key member of the SharePoint team, delivering end-to-end web applications for prominent clients such as <Bold>Turk Petrol<Bold>, <Bold>Avivasa<Bold>, <Bold>KordSA<Bold>, and <Bold>Tavuk Dünyası<Bold>.",
        "Developed enterprise-level solutions leveraging React.js and SharePoint technologies, ensuring scalability and seamless user experiences.",
        "Contributed to the design, implementation, and deployment of tailored applications to meet diverse business requirements across various industries.",
      ],
      endPoint: "",
    },
    {
      title: "Software Engineer Intern - Telenity",
      description:[
        "Contributed to the VAS and Messaging Department, focusing on feature development with <Bold>Java<Bold> and <Bold>Spring Boot<Bold>.",
        "Assisted in advancing the company's innovations in 5G technologies, ensuring alignment with cutting-edge industry trends.",
        "Gained hands-on experience in designing and implementing scalable solutions in a fast-paced telecommunications environment.",
      ],
      endPoint: "",
    },
    {
      title: " Project Manager - BAU AI Society ",
      description:[
        "Actively contributed to the <Bold>Bahçeşehir University AI Society<Bold>, organizing <Bold>AI-focused seminars, workshops,<Bold> and <Bold>networking events<Bold> to foster collaboration and knowledge sharing among students and professionals.",
        "Played a key role in promoting <Bold>artificial intelligence technologies<Bold> through educational initiatives, enhancing awareness and engagement within the academic community.",
        "Gained valuable experience in project coordination and event management while working in a team-oriented environment.",
      ],
      endPoint: "",
    },
  ];
  
  const splitBold = (description: string) => {
    const splitDescription = description.split("<Bold>");
    return (
      <span>
        {splitDescription.map((split: string, index: number) => (
          <span key={index}>
            {index % 2 !== 0 ? <Bold>{split}</Bold> : split}
          </span>
        ))}
      </span>
    );
  };

  return (
    <section id="career" className="mb-12">
      <h2 className="text-xl font-bold mb-4">Career</h2>
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
                {career.description.map((description, index) => (
                  <CardDescription key={index}>{"- "}{splitBold(description)}</CardDescription>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
