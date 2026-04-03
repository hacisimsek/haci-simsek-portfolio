import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const expertise = [
  'Java & Spring Boot',
  'React & product UI',
  'Microservices',
  'Kubernetes workflows',
];

const highlights = [
  { label: 'Years shipping products', value: '4+' },
  { label: 'Core domains', value: 'Backend + frontend' },
  { label: 'Current focus', value: 'Resilient platforms' },
];

export default function About() {
  return (
    <section id="about" className="fade-up">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="section-shell">
          <div className="eyebrow mb-6">Editorial tech portfolio</div>
          <div className="max-w-3xl">
            <h1 className="page-title">
              Java and React engineer building reliable systems with product
              taste.
            </h1>
            <p className="mt-6 page-subtitle">
              I design and ship software that stays clean under growth, from
              backend services and authentication flows to the frontend moments
              users actually feel. My work sits at the intersection of
              engineering rigor, system resilience, and intentional UI.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {expertise.map((item) => (
              <span key={item} className="meta-chip">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/contact">Start a Conversation</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-border/60 bg-background/70 p-4"
              >
                <div className="text-2xl font-semibold">{item.value}</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="section-shell flex flex-col justify-between">
          <div>
            <div className="eyebrow mb-4">Currently at Sisal</div>
            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-secondary/40 p-3">
              <Image
                src="/images/IMG_0569.JPG"
                alt="Haci Simsek"
                width={1200}
                height={1400}
                priority
                className="aspect-[4/5] w-full rounded-[1.4rem] object-cover"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Based in
              </p>
              <p className="mt-2 text-lg font-semibold">
                Istanbul, building for international products
              </p>
            </div>

            <div className="flex gap-3">
              {[
                {
                  href: 'mailto:hacisimsek@gmail.com',
                  label: 'Email',
                  icon: Mail,
                },
                {
                  href: 'https://github.com/hacisimsek',
                  label: 'GitHub',
                  icon: Github,
                },
                {
                  href: 'https://linkedin.com/in/hacisimsek',
                  label: 'LinkedIn',
                  icon: Linkedin,
                },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
