export interface Experience {
  company: string;
  location: string;
  role: string;
  start: string;
  end: string;
  current?: boolean;
  highlights: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  link?: { label: string; url: string };
  tags: string[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: 'mail' | 'phone' | 'linkedin' | 'youtube' | 'link' | 'github';
}

export interface Resume {
  name: string;
  title: string;
  tagline: string;
  about: string[];
  profileImage: string;
  location: string;
  availability: string;
  highlights: { label: string; value: string }[];
  skills: SkillGroup[];
  experience: Experience[];
  projects: ProjectItem[];
  competitive: string[];
  competitiveLink: { label: string; url: string };
  education: {
    degree: string;
    school: string;
    location: string;
    details: string;
  };
  contacts: ContactLink[];
}

// First professional role: Divine IT Limited, Nov 2017
const CAREER_START = new Date(2017, 10, 1); // month is 0-indexed

export function yearsOfExperience(): number {
  const now = new Date();
  const years = now.getFullYear() - CAREER_START.getFullYear();
  const beforeAnniversary =
    now.getMonth() < CAREER_START.getMonth() ||
    (now.getMonth() === CAREER_START.getMonth() && now.getDate() < CAREER_START.getDate());
  return beforeAnniversary ? years - 1 : years;
}

export const RESUME: Resume = {
  name: 'Shikhor Kumer Roy',
  title: 'Staff Software Engineer',
  tagline:
    'I design and build scalable backend and data-intensive systems in Java & Kotlin - the kind of platforms that quietly run the business.',
  profileImage: 'profile.png',
  location: 'Dhaka, Bangladesh',
  availability: 'Open to collaboration',

  about: [
    `I'm a Staff Software Engineer with ${yearsOfExperience()}+ years shipping production systems at scale. My focus is backend architecture, event-driven platforms, and cloud modernization - turning messy legacy systems into clean, observable services.`,
    "I've owned platforms end-to-end: from PostgreSQL schema design and Kafka/Debezium pipelines to CI/CD automation and production reliability. I care a lot about developer ergonomics, which is why I've built reusable frameworks that cut team delivery time in half.",
    "Outside work I build tools for developers (like KHelper, an IntelliJ plugin for competitive programmers) and record videos on software engineering.",
  ],

  highlights: [
    { label: 'Years of experience', value: `${yearsOfExperience()}+` },
    { label: 'Core stack', value: 'Java / Kotlin' },
    { label: 'CP Problems solved', value: '1000+' },
  ],

  skills: [
    {
      label: 'Backend & Languages',
      items: [
        'Java (8 - 21)',
        'Kotlin',
        'Spring Boot',
        'Hibernate / JPA',
        'Keycloak',
        'Agentic development (GitHub Copilot, Claude Code)',
      ],
    },
    {
      label: 'Event-Driven & Data',
      items: ['Apache Kafka', 'Debezium CDC', 'Elasticsearch'],
    },
    {
      label: 'Databases & Storage',
      items: ['PostgreSQL (Ltree)', 'MySQL', 'Couchbase', 'MongoDB', 'Azure Blob Storage'],
    },
    {
      label: 'Cloud & DevOps',
      items: ['Azure Cloud', 'Docker Compose', 'Kubernetes', 'Bitbucket Pipelines', 'Jenkins', 'Shell Scripting'],
    },
    {
      label: 'Observability & Quality',
      items: ['Prometheus', 'Grafana', 'ELK Stack', 'SonarQube', 'SBOM', 'Dependency-Track'],
    },
    {
      label: 'Frontend',
      items: ['Angular', 'ReactJS', 'Vanilla JS'],
    },
  ],

  experience: [
    {
      company: 'Cefalo Bangladesh Ltd',
      location: 'Dhaka, Bangladesh',
      role: 'Staff Software Engineer (Fullstack)',
      start: 'Mar 2025',
      end: 'Present',
      current: true,
      highlights: [
        'Own the backend end-to-end - Kotlin/Spring Boot services running real production traffic.',
        'Replaced fragile polling with Kafka + Debezium CDC pipelines: data stays consistent across services even under failure.',
        'Modeled complex hierarchical data in PostgreSQL with Ltree - clean queries, no recursive CTE soup.',
        'Built Elasticsearch search over millions of records - sub-second results, production-grade.',
        'Wired up Keycloak across the stack so auth is centralized and not reinvented per service.',
        'Right storage for the right data: MongoDB for documents, Azure Blob for binaries, Postgres for everything queryable.',
        'Wrote the CI/CD pipelines the team actually trusts - Bitbucket + shell scripting, zero manual deploys.',
        'Led AWS → Azure migration. Production stayed up. Nobody noticed the move.',
        'Quality gates in CI block bad code and vulnerable deps before they ever reach review - SonarQube, SBOM, Dependency-Track.',
        'Hunted down bugs that had survived years in prod. Added tests so they stay dead.',
        'Built the observability layer from scratch - Prometheus + Grafana, so on-call knows exactly what broke and when.',
      ],
    },
    {
      company: 'BJIT Limited',
      location: 'Dhaka, Bangladesh',
      role: 'Principal Software Engineer (Java)',
      start: 'Mar 2020',
      end: 'Feb 2025',
      highlights: [
        'Embedded with world-class e-commerce teams - shipped features on an Agile cadence that actually worked.',
        'Built CRUDer: a Spring meta-framework that cut CRUD development time and code duplication by 60% across the team.',
        'Automated SAP data extraction - turned 3+ manual man-days per cycle into a script that runs itself and catches its own errors.',
        'Added smoke tests to the Jenkins pipeline: critical failures now surface in minutes, not after a full QA pass.',
        'Migrated live services from Java 11/WebFlux to Java 21 + Spring Boot 3.2 + Virtual Threads - same logic, meaningfully better throughput.',
        'Built a ReactJS component library (charts, animated sections, parallax) reused across multiple products.',
      ],
    },
    {
      company: 'Ethics Advanced Technology Limited',
      location: 'Dhaka, Bangladesh',
      role: 'Software Engineer (Java)',
      start: 'Nov 2019',
      end: 'Feb 2020',
      highlights: [
        'Designed microservices from the ground up - Java, Spring Boot, Kafka, MSSQL, Liquibase. Full stack, short runway.',
        'Executed a live data migration without downtime.',
      ],
    },
    {
      company: 'Digitruck Bangladesh',
      location: 'Dhaka, Bangladesh',
      role: 'Lead Software Engineer (Android, Kotlin)',
      start: 'Aug 2019',
      end: 'Sep 2019',
      highlights: [
        'Led 4 engineers to ship a logistics platform MVP from zero - on time.',
        'Designed the full MVVM architecture with Android Jetpack before the first line of feature code was written.',
        'Shipped partner registration, order management, ratings, analytics, and localization in a single sprint cycle.',
      ],
    },
    {
      company: 'Divine IT Limited',
      location: 'Dhaka, Bangladesh',
      role: 'Software Engineer (Java)',
      start: 'Nov 2017',
      end: 'Jul 2019',
      highlights: [
        'Where it started - built ERP modules in Java/Spring Boot for real business operations.',
        'Implemented centralized auth before most teams were calling it IAM.',
        'Owned production deployments and support - learned the hard way why observability matters.',
      ],
    },
  ],

  projects: [
    {
      name: 'KHelper',
      description:
        'An IntelliJ IDEA plugin that streamlines competitive programming workflows for Java and Kotlin - test runner, template scaffolding, parser integration.',
      link: {
        label: 'View on JetBrains Marketplace',
        url: 'https://plugins.jetbrains.com/plugin/29521-khelper',
      },
      tags: ['IntelliJ Plugin', 'Kotlin', 'Java', 'Developer Tools'],
    },
    {
      name: 'Start With Shikhor Roy - YouTube',
      description:
        'Engineering-focused video content covering backend systems, best practices, and developer experience.',
      link: {
        label: 'Watch on YouTube',
        url: 'https://www.youtube.com/@StartWithShikhorRoy',
      },
      tags: ['Content', 'Education'],
    },
  ],

  competitive: [
    'Solved 1000+ problems across multiple online judges.',
    'Best ranking: 24th position - ACM ICPC Dhaka Regional 2014.',
    'All competitive programming profiles:',
  ],

  competitiveLink: {
    label: 'lnk.bio/shikhorroy',
    url: 'https://lnk.bio/shikhorroy',
  },

  education: {
    degree: 'B.Sc. in Computer Science & Engineering (2015)',
    school: 'Hajee Mohammad Danesh Science & Technology University',
    location: 'Dinajpur, Bangladesh',
    details: 'CGPA: 3.26 / 4.00',
  },

  contacts: [
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/shikhorroy',
      href: 'https://www.linkedin.com/in/shikhorroy',
      icon: 'linkedin',
    },
    {
      label: 'YouTube',
      value: '@StartWithShikhorRoy',
      href: 'https://www.youtube.com/@StartWithShikhorRoy',
      icon: 'youtube',
    },
    {
      label: 'Profiles',
      value: 'lnk.bio/shikhorroy',
      href: 'https://lnk.bio/shikhorroy',
      icon: 'link',
    },
  ],
};
