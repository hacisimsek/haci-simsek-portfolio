import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import portrait from '@/assets/images/portrait.jpg';
import { profile, t } from '@/content';
import { careerYears } from '@/lib/dates';

// Prose beside the portrait. Role, company and contact links live in the
// hero and the closing section, so they are not repeated here.
export default function About() {
  const msg = useTranslations('About');
  const locale = useLocale();
  const years = `${careerYears(profile.careerStart)}+`;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start"
    >
      <div className="max-w-[36rem]">
        <h2 id="about-title" className="section-title">
          {msg('title')}
        </h2>
        <p className="mt-5 text-base leading-8 text-foreground">
          {t(profile.intro, locale).replace('{years}', years)}
        </p>
        {t(profile.bio, locale).map((paragraph) => (
          <p
            key={paragraph}
            className="mt-4 text-base leading-8 text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
        <ul className="mt-8 flex flex-wrap gap-2">
          {t(profile.expertise, locale).map((item) => (
            <li key={item} className="meta-chip">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* The photo is a wide travel shot; zoom in on the person so the face
          reads at portrait size. */}
      <div className="aspect-4/5 w-full max-w-sm overflow-hidden rounded-[1.4rem] lg:max-w-none">
        <Image
          src={portrait}
          alt={profile.name}
          placeholder="blur"
          sizes="(min-width: 1024px) 640px, 200vw"
          className="h-full w-full origin-[50%_95%] scale-200 object-cover"
        />
      </div>
    </section>
  );
}
