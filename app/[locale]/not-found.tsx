import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFoundPage() {
  const msg = useTranslations('NotFound');

  return (
    <section className="fade-up space-y-6 pb-6">
      <div className="section-shell">
        <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
        <h1 className="page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('text')}</p>
        <Link href="/" className="mt-6 inline-block underline">
          {msg('home')}
        </Link>
      </div>
    </section>
  );
}
