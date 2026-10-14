import { useTranslations } from 'next-intl';
import NotFoundTerminal from '@/components/terminal/not-found-terminal';
import { Link } from '@/i18n/navigation';

export default function NotFoundPage() {
  const msg = useTranslations('NotFound');

  return (
    <section className="space-y-6 pb-6">
      <div className="section-shell">
        <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
        <h1 className="page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('text')}</p>
        <NotFoundTerminal />
        <Link href="/" className="mt-6 inline-block underline">
          {msg('home')}
        </Link>
      </div>
    </section>
  );
}
