const education = [
  {
    school: 'Bahcesehir University',
    location: 'Istanbul, Turkey',
    degree: 'BSc, Electrical and Electronic Engineering',
    track: 'Major',
    period: 'Sep 2017 - Jun 2021',
  },
  {
    school: 'Bahcesehir University',
    location: 'Istanbul, Turkey',
    degree: 'BSc, Software Engineering',
    track: 'Minor',
    period: 'Sep 2019 - Jun 2021',
  },
];

export default function Education() {
  return (
    <section className="fade-up">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow mb-4">Education</div>
            <h2 className="section-title">Engineering foundation across hardware and software</h2>
          </div>
          <p className="section-copy">
            My background combines software systems thinking with electrical and
            electronics fundamentals, which still influences how I reason about
            architecture, constraints, and reliability.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {education.map((item) => (
            <article
              key={`${item.degree}-${item.track}`}
              className="rounded-[1.6rem] border border-border/70 bg-background/75 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="meta-chip">{item.track}</span>
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {item.period}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold">{item.degree}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.school} · {item.location}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
