import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/contact/contact-form';
import { profile } from '@/content';
import { pageMetadata } from '@/lib/page-metadata';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  return pageMetadata(locale, '/contact', 'contactTitle');
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
    { title: msg('bestFitTitle'), text: msg('bestFitText') },
    { title: msg('helpsTitle'), text: msg('helpsText') },
    {
      title: msg('emailTitle'),
      text: msg('emailText', { email: profile.email }),
    },
  ];

  return (
    <section className="grid gap-6 pb-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="pt-2">
        <h1 className="page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('subtitle')}</p>

        <dl className="mt-8 divide-y divide-border/70 border-y border-border/70">
          {notes.map(({ title, text }) => (
            <div key={title} className="py-5">
              <dt>
                <h2 className="text-lg font-semibold">{title}</h2>
              </dt>
              <dd className="mt-2 text-sm leading-7 text-muted-foreground">
                {text}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="section-shell">
        <div className="mb-6">
          <h2 className="section-title">{msg('formTitle')}</h2>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
