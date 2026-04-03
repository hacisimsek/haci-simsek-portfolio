const roles = [
  {
    company: 'Sisal',
    title: 'Software Development Senior Specialist',
    period: 'Jun 2022 - Present',
    summary:
      'Building Spring Boot microservices and production-ready backend flows in a regulated digital gaming and payments environment.',
    bullets: [
      'Worked across authentication, account, session, profile, and content-related domains with a focus on reliability and maintainability.',
      'Built resilient integrations using messaging, retry strategies, and service-to-service communication patterns for fault-tolerant processing.',
      'Contributed to CI/CD and cloud-native operations with Kubernetes, ArgoCD, observability tooling, load testing, and performance tuning.',
    ],
  },
  {
    company: 'Nuevo Software House',
    title: 'Software Engineer',
    period: 'Sep 2021 - Jun 2022',
    summary:
      'Delivered end-to-end web applications for enterprise clients across multiple industries.',
    bullets: [
      'Built business-facing interfaces with React.js and SharePoint for clients including Turk Petrol, Avivasa, KordSA, and Tavuk Dunyasi.',
      'Balanced maintainability, user experience, and client-specific workflows across enterprise implementations.',
      'Supported implementation and release of tailored solutions in close collaboration with product and delivery teams.',
    ],
  },
  {
    company: 'Telenity',
    title: 'Software Engineer Intern',
    period: 'Jun 2021 - Aug 2021',
    summary: 'Started in telecom-focused backend development and message systems.',
    bullets: [
      'Contributed to VAS and messaging features using Java and Spring Boot.',
      'Learned how scalable backend services behave in demanding environments.',
    ],
  },
];

export default function Career() {
  return (
    <section id="career" className="fade-up">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow mb-4">Career timeline</div>
            <h2 className="section-title">Experience with visible product impact</h2>
          </div>
          <p className="section-copy">
            Most of my recent work sits in backend-heavy systems where scale,
            release confidence, observability, and service reliability matter
            as much as implementation itself.
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-0 before:left-[11px] before:top-3 before:w-px before:bg-border/80 sm:before:left-[151px]">
          {roles.map((role) => (
            <article
              key={`${role.company}-${role.title}`}
              className="relative grid gap-5 sm:grid-cols-[120px_1fr]"
            >
              <div className="relative z-10 flex items-start gap-4 sm:block">
                <span className="mt-2 block h-6 w-6 rounded-full border border-accent/30 bg-accent/90 shadow-[0_0_0_6px_hsl(var(--background))]" />
                <div className="sm:pt-0.5">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {role.period}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-background/70 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{role.title}</h3>
                    <p className="mt-1 text-sm text-accent">{role.company}</p>
                  </div>
                  <div className="meta-chip w-fit">Backend and platform engineering</div>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {role.summary}
                </p>

                <div className="mt-5 grid gap-3">
                  {role.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm leading-7 text-muted-foreground"
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
