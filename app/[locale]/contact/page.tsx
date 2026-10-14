import { Mail, MessageSquareText, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/contact/contact-form';
import { profile } from '@/content';
import { routing } from '@/i18n/routing';
import { alternatesFor } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const msg = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: msg('contactTitle'),
    alternates: alternatesFor('/contact', locale),
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const msg = await getTranslations({ locale, namespace: 'Contact' });
  const notes = [
    { icon: Sparkles, title: msg('bestFitTitle'), text: msg('bestFitText') },
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
  ];

  return (
    <section className="grid fade-up gap-6 pb-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="section-shell">
        <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
        <h1 className="page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('subtitle')}</p>

        <div className="mt-8 space-y-4">
          {notes.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <Icon aria-hidden className="h-4 w-4" />
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
        <ContactForm />
      </div>
    </section>
  );
}
