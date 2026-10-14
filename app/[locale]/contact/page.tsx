'use client';

import { Mail, MessageSquareText, Send, Sparkles } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { profile } from '@/content';

export default function Contact() {
  const msg = useTranslations('Contact');
  const [state, handleSubmit] = useForm('xanyoozp');

  if (state.succeeded) {
    return (
      <section className="fade-up">
        <div className="section-shell max-w-3xl">
          <div className="mb-4 eyebrow">{msg('successEyebrow')}</div>
          <h1 className="page-title">{msg('successTitle')}</h1>
          <p className="mt-5 page-subtitle">{msg('successText')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid fade-up gap-6 pb-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="section-shell">
        <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
        <h1 className="page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('subtitle')}</p>

        <div className="mt-8 space-y-4">
          {[
            {
              icon: Sparkles,
              title: msg('bestFitTitle'),
              text: msg('bestFitText'),
            },
            {
              icon: MessageSquareText,
              title: msg('helpsTitle'),
              text: msg('helpsText'),
            },
            {
              icon: Mail,
              title: msg('emailTitle'),
              text: msg('emailText', { email: profile.email }),
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-border/70 bg-background/75 p-5"
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
          <div className="mb-4 eyebrow">{msg('formEyebrow')}</div>
          <h2 className="section-title">{msg('formTitle')}</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              type="text"
              name="name"
              placeholder={msg('namePlaceholder')}
              aria-label={msg('namePlaceholder')}
              className="h-12 rounded-2xl border-border/70 bg-background/75 px-4"
            />
            <Input
              id="email"
              type="email"
              name="email"
              placeholder={msg('emailPlaceholder')}
              aria-label={msg('emailPlaceholder')}
              className="h-12 rounded-2xl border-border/70 bg-background/75 px-4"
            />
          </div>
          <ValidationError
            prefix={msg('emailPrefix')}
            field="email"
            errors={state.errors}
          />

          <Textarea
            id="message"
            name="message"
            placeholder={msg('messagePlaceholder')}
            aria-label={msg('messageLabel')}
            rows={8}
            className="rounded-[1.6rem] border-border/70 bg-background/75 px-4 py-3"
          />
          <ValidationError
            prefix={msg('messagePrefix')}
            field="message"
            errors={state.errors}
          />

          <Button
            type="submit"
            disabled={state.submitting}
            className="rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
          >
            <Send className="mr-2 h-4 w-4" />
            {state.submitting ? msg('sending') : msg('send')}
          </Button>
        </form>
      </div>
    </section>
  );
}
