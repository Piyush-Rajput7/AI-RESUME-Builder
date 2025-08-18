export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Certification';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface Resume {
  id?: string;
  userId?: string;
  title: string;
  personalInfo: PersonalInfo;
  professionalSummary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  templateId: string;
  atsScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ATSReport {
  score: number;
  issues: ATSIssue[];
  keywords: KeywordAnalysis;
  formatting: FormattingAnalysis;
  recommendations: string[];
}

export interface ATSIssue {
  type: 'critical' | 'warning' | 'suggestion';
  category: 'formatting' | 'content' | 'keywords' | 'structure';
  message: string;
  section?: string;
}

export interface KeywordAnalysis {
  missing: string[];
  present: string[];
  density: { [key: string]: number };
  suggestions: string[];
}

export interface FormattingAnalysis {
  hasProperHeadings: boolean;
  hasConsistentFormatting: boolean;
  readableFont: boolean;
  appropriateLength: boolean;
  issues: string[];
}

export interface JobAnalysis {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  experienceLevel: string;
  industry: string;
}

export interface UserContext {
  targetJobTitle: string;
  industry: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}