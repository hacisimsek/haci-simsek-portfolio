import { useTranslations } from 'next-intl';
import NotFoundTerminal from '@/components/terminal/not-found-terminal';
import { Link } from '@/i18n/navigation';

export default function NotFoundPage() {
  const msg = useTranslations('NotFound');

  return (
    <section className="space-y-6 pb-6">
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
