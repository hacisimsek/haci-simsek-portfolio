"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, ValidationError } from "@formspree/react";

export default function Contact() {
  const [state, handleSubmit, reset] = useForm("xanyoozp");
  if (state.succeeded) {
    return <div>Thank you for signing up!</div>;
  }
  return (
    <section id="contact" className="mb-12">
      <h4 className="text-xl font-bold mb-4">Contact Me</h4>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input type="text" placeholder="Your Name" aria-label="Your Name" />
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Your Email"
          aria-label="Your Email"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
        <Textarea
          id="message"
          name="message"
          placeholder="Your Message"
          aria-label="Your Message"
          rows={5}
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
        />
        <Button type="submit" disabled={state.submitting}>
          Send Message
        </Button>
      </form>
    </section>
  );
}
