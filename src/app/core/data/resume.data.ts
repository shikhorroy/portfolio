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
