export enum SKILL_LEVEL {
  NOVICE = 'Novice',
  BEGINNER = 'Beginner',
  SKILLFUL = 'Skillfull',
  EXPERIENCED = 'Experienced',
  EXPERT = 'Expert',
}

export interface CustomSection {
  name?: string;
  description?: string;
  city?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  [key: string]: any;
}

export interface IProject extends CustomSection {}

export interface IExperience extends CustomSection {
  jobTitle?: string;
  company?: string;
}

export interface IEducation extends CustomSection {
  school?: string;
  degree?: string;
}

export interface ISkill {
  name?: string;
  level?: SKILL_LEVEL;
}

export interface IPersonalInfo {
  jobTitle?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
}

export interface IResumeData {
  personalInfo?: IPersonalInfo;
  summary?: string;
  projects?: Array<IProject>;
  experience?: Array<IExperience>;
  education?: Array<IEducation>;
  skills?: Array<ISkill>;
  [key: string]: CustomSection | any;
}

export enum RESUME_SECTION {
  PERSONAL_INFO = 'personalInfo',
  SUMMARY = 'summary',
  EXPERIENCE = 'experience',
  SKILLS = 'skills',
  EDUCATION = 'education',
  PROJECTS = 'projects',
}

export const DEFAULT_RESUME_LIST_SECTIONS = [
  // {
  //   header: 'Personal Info',
  //   formGroupName: RESUME_SECTION.PERSONAL_INFO,
  // },
  {
    header: 'Summary',
    formGroupName: RESUME_SECTION.SUMMARY,
  },
  {
    header: 'Experience',
    formGroupName: RESUME_SECTION.EXPERIENCE,
  },
  {
    header: 'Skills',
    formGroupName: RESUME_SECTION.SKILLS,
  },
  {
    header: 'Education',
    formGroupName: RESUME_SECTION.EDUCATION,
  },
  {
    header: 'Projects',
    formGroupName: RESUME_SECTION.PROJECTS,
  },
];

export const SKILL_LEVEL_OPTIONS = [
  {
    label: 'Novice',
    value: SKILL_LEVEL.NOVICE,
  },
  {
    label: 'Beginner',
    value: SKILL_LEVEL.BEGINNER,
  },
  {
    label: 'Skillful',
    value: SKILL_LEVEL.SKILLFUL,
  },
  {
    label: 'Experienced',
    value: SKILL_LEVEL.EXPERIENCED,
  },
  {
    label: 'Expert',
    value: SKILL_LEVEL.EXPERT,
  },
];
