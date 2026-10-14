'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  contactSchema,
  FORMSPREE_ENDPOINT,
  submitContact,
  type ContactValues,
} from '@/lib/contact';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'done' | 'failed';

const defaultValues: ContactValues = {
  name: '',
  email: '',
  message: '',
  website: '',
};

const field =
  'rounded-2xl border-border/70 bg-background/60 px-4 aria-invalid:border-destructive';

function DrawnCheck() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4">
      <path
        className="check-draw"
        d="M4 12.5l5 5L20 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactForm() {
  const msg = useTranslations('Contact');
  const [status, setStatus] = useState<Status>('idle');
  const sending = useRef(false);
  const success = useRef<HTMLDivElement>(null);
  const schema = useMemo(
    () => contactSchema((key) => msg(`errors.${key}`)),
    [msg]
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues,
    shouldFocusError: true,
  });

  // Let the drawn check play before the form gives way to the thank-you note.
  useEffect(() => {
    if (status !== 'sent') return;
    const timer = window.setTimeout(() => setStatus('done'), 600);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status === 'done') success.current?.focus();
  }, [status]);

  async function onValid(values: ContactValues) {
    // A second Enter or click while the first request is in flight is ignored.
    if (sending.current) return;
    sending.current = true;
    setStatus('sending');
    const result = await submitContact(values);
    sending.current = false;
    setStatus(result === 'sent' ? 'sent' : 'failed');
  }

  if (status === 'done') {
    return (
      <div
        ref={success}
        role="status"
        aria-labelledby="contact-success"
        tabIndex={-1}
        className="rounded-3xl border border-accent/40 bg-accent/10 p-6 outline-none"
      >
        <div className="mb-3 eyebrow w-fit">{msg('successEyebrow')}</div>
        <h3 id="contact-success" className="section-title">
          {msg('successTitle')}
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {msg('successText')}
        </p>
      </div>
    );
  }

  const describe = (name: keyof ContactValues) =>
    errors[name] ? `contact-${name}-error` : undefined;
  const error = (name: keyof ContactValues) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className="mt-2 text-sm text-destructive">
        {errors[name]?.message}
      </p>
    ) : null;

  return (
    <form
      method="POST"
      action={FORMSPREE_ENDPOINT}
      noValidate
      onSubmit={(event) => handleSubmit(onValid)(event)}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-medium"
          >
            {msg('nameLabel')}
          </label>
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder={msg('namePlaceholder')}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe('name')}
            className={cn('h-12', field)}
            {...register('name')}
          />
          {error('name')}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-sm font-medium"
          >
            {msg('emailLabel')}
          </label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder={msg('emailPlaceholder')}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe('email')}
            className={cn('h-12', field)}
            {...register('email')}
          />
          {error('email')}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-sm font-medium"
        >
          {msg('messageLabel')}
        </label>
        <Textarea
          id="contact-message"
          rows={8}
          placeholder={msg('messagePlaceholder')}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe('message')}
          className={cn('py-3', field)}
          {...register('message')}
        />
        {error('message')}
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">{msg('honeypotLabel')}</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      {status === 'failed' ? (
        <p
          role="alert"
          className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm"
        >
          {msg('failed')}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={status === 'sending' || status === 'sent'}
        className="min-w-44 rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
      >
        {status === 'sending' ? (
          <>
            <Loader2 aria-hidden className="mr-2 h-4 w-4 animate-spin" />
            {msg('sending')}
          </>
        ) : status === 'sent' ? (
          <>
            <DrawnCheck />
            <span className="ml-2">{msg('sent')}</span>
          </>
        ) : (
          <>
            <Send aria-hidden className="mr-2 h-4 w-4" />
            {msg('send')}
          </>
        )}
      </Button>
    </form>
  );
}
