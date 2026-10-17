export type Locale = 'en' | 'tr';

export type L10n<T = string> = Record<Locale, T>;

type Month =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12';

export type YearMonth = `${number}-${Month}`;

export interface Role {
  id: string;
  company: L10n;
  title: L10n;
  team?: L10n;
  kind: 'employment' | 'internship' | 'leadership';
  focus: L10n;
  start: YearMonth;
  end: YearMonth | null;
  summary: L10n;
  highlights: L10n<string[]>;
}

export interface EducationItem {
  id: string;
  school: L10n;
  location: L10n;
  degree: L10n;
  track: 'major' | 'minor';
  trackLabel: L10n;
  start: YearMonth;
  end: YearMonth;
  notes: L10n<string[]>;
}

export interface SkillCategory {
  id: string;
  title: L10n;
  items: L10n<string[]>;
}

export interface Social {
  id: 'github' | 'linkedin' | 'x' | 'medium';
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  asciiName: string;
  /** The headline title, from the CV. */
  title: L10n;
  /** The official title at the current company. */
  role: L10n;
  currentCompany: string;
  headline: L10n;
  intro: L10n;
  bio: L10n<string[]>;
  location: L10n;
  city: L10n;
  email: string;
  careerStart: YearMonth;
  expertise: L10n<string[]>;
  environment: L10n;
  certifications: L10n<string[]>;
  languages: L10n<string[]>;
}

export interface FeaturedProject {
  name: string;
  flagship?: boolean;
  /** Authored from the repo's README; replaces the GitHub description. */
  summary: L10n;
}
