'use client';

import { Mail, MessageSquareText, Send, Sparkles } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  const [state, handleSubmit] = useForm('xanyoozp');

  if (state.succeeded) {
    return (
      <section className="fade-up">
        <div className="section-shell max-w-3xl">
          <div className="eyebrow mb-4">Message received</div>
          <h1 className="page-title">Thanks, I&apos;ll get back to you soon.</h1>
          <p className="mt-5 page-subtitle">
            If the topic is a good fit, I usually respond with concrete next
            steps instead of a generic placeholder reply.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 pb-6 fade-up lg:grid-cols-[0.9fr_1.1fr]">
      <div className="section-shell">
        <div className="eyebrow mb-4">Contact</div>
        <h1 className="page-title">Let&apos;s talk about product, platform, or both</h1>
        <p className="mt-5 page-subtitle">
          If you are building something that needs solid backend foundations,
          thoughtful frontend execution, or an engineer who can move across the
          stack without losing clarity, send a note.
        </p>

        <div className="mt-8 space-y-4">
          {[
            {
              icon: Sparkles,
              title: 'Best fit',
              text: 'Product engineering, platform work, architecture cleanup, and UI implementation with strong technical judgment.',
            },
            {
              icon: MessageSquareText,
              title: 'What helps',
              text: 'A short summary of the problem, current stack, and the outcome you want to reach.',
            },
            {
              icon: Mail,
              title: 'Direct email',
              text: 'You can also reach me at hacisimsek@gmail.com.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-shell">
        <div className="mb-6">
          <div className="eyebrow mb-4">Send a message</div>
          <h2 className="section-title">A concise brief is enough to start</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              type="text"
              name="name"
              placeholder="Your name"
              aria-label="Your name"
              className="h-12 rounded-2xl border-border/70 bg-background/75 px-4"
            />
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Your email"
              aria-label="Your email"
              className="h-12 rounded-2xl border-border/70 bg-background/75 px-4"
            />
          </div>
          <ValidationError prefix="Email" field="email" errors={state.errors} />

          <Textarea
            id="message"
            name="message"
            placeholder="What are you building and where do you need help?"
            aria-label="Your message"
            rows={8}
            className="rounded-[1.6rem] border-border/70 bg-background/75 px-4 py-3"
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />

          <Button
            type="submit"
            disabled={state.submitting}
            className="rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
          >
            <Send className="mr-2 h-4 w-4" />
            {state.submitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </section>
  );
}
