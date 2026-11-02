import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import NotFoundTerminal from '@/components/terminal/not-found-terminal';
import { Link } from '@/i18n/navigation';

// Without its own title the 404 would read as the home page in the tab.
export async function generateMetadata(): Promise<Metadata> {
  const msg = await getTranslations('NotFound');
  return { title: msg('title') };
}

export default function NotFoundPage() {
  const msg = useTranslations('NotFound');

  return (
    <section data-not-found className="space-y-6 pb-6">
      <header className="pt-2">
        <h1 className="page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('text')}</p>
      </header>
      <NotFoundTerminal />
      <Link href="/" className="inline-flex min-h-11 items-center underline">
        {msg('home')}
      </Link>
    </section>
  );
}
