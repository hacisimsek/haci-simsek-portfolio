import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <section id="contact" className="mb-12" >
      <h4 className="text-xl font-bold mb-4">Contact Me</h4>
      <form className="space-y-4" action="https://formspree.io/f/xanyoozp" method="POST">
        <Input type="text" placeholder="Your Name" required aria-label="Your Name"/>
        <Input type="email" placeholder="Your Email" required aria-label="Your Email"/>
        <Textarea placeholder="Your Message" required aria-label="Your Message" rows={5}/>
        <Button type="submit">Send Message</Button>
      </form>
    </section>
  );
}
