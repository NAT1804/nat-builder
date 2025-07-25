import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DEFAULT_RESUME_LIST_SECTIONS,
  IResumeData,
  SKILL_LEVEL,
} from '@models/resume.model';
import { exportToPdf } from '@utils/export-pdf';
import { printResume } from '@utils/print-doc';
import { FontConfigService } from '@services/font-config/font-config.service';
import { SvgGeneratorService } from '@services/svg-generator/svg-generator.service';
import { SvgConfig } from '@models/svg.model';
import { NG_ZORRO_MODULES } from '../../shared/ng-zorro.module';
import { FormDataEntryComponent } from './form-data-entry/form-data-entry.component';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormDataEntryComponent,
    ...NG_ZORRO_MODULES,
  ],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.less',
})
export class FormBuilderComponent {
  @ViewChild('svgContainer', { static: true })
  svgContainerRef!: ElementRef<HTMLElement>;

  private fontConfigService = inject(FontConfigService);
  private svgGeneratorService = inject(SvgGeneratorService);

  initialListSections = [...DEFAULT_RESUME_LIST_SECTIONS];
  currentFormData!: IResumeData;

  // Font control properties
  listFonts = this.fontConfigService.getAvailableFonts();
  selectedFont = this.listFonts[0].value;
  baseFontSize = 5;

  // Settings panel visibility
  showActionPanel = false;

  // Page splitting control
  enablePageSplitting = true;

  // Pagination properties
  private _currentPage = 1;
  totalPages = 1;
  usePagination = true; // Toggle between pagination and side-by-side view

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(value: number) {
    if (this._currentPage !== value) {
      this._currentPage = value;
      this.updatePreview(this.currentFormData);
    }
  }

  // SVG Configuration
  private svgConfig: SvgConfig = this.fontConfigService.getDefaultConfig();

  defaultResumeForm: IResumeData = {
    personalInfo: {
      jobTitle: 'Software Engineer',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St',
      city: 'Anytown',
      country: 'USA',
      avatar: 'https://via.placeholder.com/150',
    },
    summary:
      'Experienced software engineer with expertise in web development and problem-solving.',
    projects: [
      {
        name: 'Resume Builder App',
        description:
          '<p>Built a modern resume builder application using Angular and TypeScript.</p><ul><li>Implemented dynamic SVG generation for resume layouts</li><li>Created responsive user interface with drag-and-drop functionality</li><li>Integrated PDF export capabilities</li><li>Deployed on cloud infrastructure with CI/CD pipeline</li></ul>',
        city: 'Remote',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-01'),
      },
      {
        name: 'E-commerce Platform',
        description:
          '<p>Developed a full-stack e-commerce solution for small businesses.</p><ul><li>Built shopping cart and payment processing system</li><li>Implemented user authentication and authorization</li><li>Created admin dashboard for inventory management</li><li>Optimized database queries for better performance</li></ul>',
        city: 'Remote',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-12-31'),
      },
      {
        name: 'Task Management System',
        description:
          '<p>Created a collaborative task management application.</p><ul><li>Developed real-time collaboration features</li><li>Implemented task scheduling and notifications</li><li>Built RESTful API with comprehensive documentation</li><li>Added data visualization and reporting features</li></ul>',
        city: 'Remote',
        startDate: new Date('2022-06-01'),
        endDate: new Date('2023-02-28'),
      },
    ],
    experience: [
      {
        jobTitle: 'Senior Software Engineer',
        company: 'Tech Corp',
        description:
          '<p>Led development of web applications and mentored junior developers. Worked extensively with modern JavaScript frameworks including React and Angular.</p><ul><li>Designed and implemented scalable microservices architecture</li><li>Mentored 5+ junior developers and conducted code reviews</li><li>Improved application performance by 40% through optimization</li><li>Led cross-functional teams of 8+ members</li></ul>',
        city: 'San Francisco, CA',
        startDate: new Date('2022-01-01'),
        endDate: null,
      },
      {
        jobTitle: 'Software Engineer',
        company: 'StartupCo',
        description:
          '<p>Developed full-stack web applications using modern technologies.</p><ul><li>Built RESTful APIs using Node.js and Express</li><li>Implemented responsive front-end interfaces</li><li>Managed cloud infrastructure on AWS</li><li>Participated in agile development processes</li></ul>',
        city: 'Austin, TX',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2021-12-31'),
      },
      {
        jobTitle: 'Junior Developer',
        company: 'WebDev Solutions',
        description:
          '<p>Started career developing websites and learning industry best practices.</p><ul><li>Developed client websites using HTML, CSS, and JavaScript</li><li>Learned version control with Git and GitHub</li><li>Collaborated with design teams on UI/UX implementation</li><li>Fixed bugs and added new features to existing applications</li></ul>',
        city: 'Remote',
        startDate: new Date('2019-01-01'),
        endDate: new Date('2020-05-31'),
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        description: 'Graduated with honors, focus on software engineering.',
        city: 'Boston, MA',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-05-01'),
      },
    ],
    skills: [
      { name: 'JavaScript', level: SKILL_LEVEL.EXPERT },
      { name: 'TypeScript', level: SKILL_LEVEL.EXPERT },
      { name: 'Angular', level: SKILL_LEVEL.EXPERIENCED },
      { name: 'React', level: SKILL_LEVEL.EXPERIENCED },
      { name: 'Node.js', level: SKILL_LEVEL.SKILLFUL },
      { name: 'Python', level: SKILL_LEVEL.EXPERIENCED },
      { name: 'Docker', level: SKILL_LEVEL.SKILLFUL },
      { name: 'AWS', level: SKILL_LEVEL.EXPERIENCED },
      { name: 'MongoDB', level: SKILL_LEVEL.EXPERIENCED },
      { name: 'PostgreSQL', level: SKILL_LEVEL.SKILLFUL },
      { name: 'Git', level: SKILL_LEVEL.EXPERT },
      { name: 'Jest', level: SKILL_LEVEL.EXPERIENCED },
      { name: 'Webpack', level: SKILL_LEVEL.SKILLFUL },
      { name: 'GraphQL', level: SKILL_LEVEL.EXPERIENCED },
      { name: 'Redux', level: SKILL_LEVEL.EXPERIENCED },
    ],
  };

  constructor() {
    this.currentFormData = this.defaultResumeForm;
  }

  onFormDataChange(formData: IResumeData) {
    this.currentFormData = formData;
    this.updateTotalPages();
    this.updatePreview(formData);
  }

  onListSectionsChange(listSections: any) {
    this.initialListSections = listSections;
    this.updateTotalPages();
    this.updatePreview(this.currentFormData);
  }

  // Font control event handlers
  onFontChange(font: string) {
    this.updateFontConfig(font);
  }

  onFontSizeChange(size: number) {
    if (size) {
      this.updateFontConfig(undefined, size);
    }
  }

  onPageSplittingChange(enabled: boolean) {
    this.enablePageSplitting = enabled;
    this.updatePageSplittingConfig(enabled);
  }

  // Watch for pagination changes
  private previousPage = 1;

  onTogglePaginationMode() {
    this.usePagination = !this.usePagination;
    if (this.usePagination) {
      this.currentPage = 1;
    }
    this.updatePreview(this.currentFormData);
  }

  // Download resume
  downloadResume() {
    if (!this.svgContainerRef) return;
    const svgElement = this.svgContainerRef.nativeElement.querySelector('svg');
    exportToPdf(svgElement, 'Resume.pdf');
  }

  // Print resume
  printResume() {
    if (!this.svgContainerRef) return;
    const svgElement = this.svgContainerRef.nativeElement.querySelector('svg');
    printResume(svgElement);
  }

  // Toggle action panel visibility
  toggleActionPanel() {
    this.showActionPanel = !this.showActionPanel;
  }

  // Method to update font configuration
  private updateFontConfig(fontFamily?: string, baseFontSize?: number) {
    this.svgConfig = this.fontConfigService.updateFontConfig(
      this.svgConfig,
      fontFamily,
      baseFontSize
    );
    // Regenerate preview with new settings
    this.updateTotalPages();
    this.updatePreview(this.currentFormData);
  }

  // Method to update page splitting configuration
  private updatePageSplittingConfig(enabled: boolean) {
    this.svgConfig = {
      ...this.svgConfig,
      page: {
        ...this.svgConfig.page,
        enablePageSplitting: enabled,
      },
    };
    // Regenerate preview with new settings
    this.updateTotalPages();
    this.updatePreview(this.currentFormData);
  }

  // Method to update total pages count
  private updateTotalPages() {
    if (!this.enablePageSplitting) {
      this.totalPages = 1;
      return;
    }

    this.totalPages = this.svgGeneratorService.getTotalPages(
      this.currentFormData,
      this.svgConfig,
      this.initialListSections
    );

    // Ensure current page is within bounds
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  // SVG preview methods
  private updatePreview(formData: any) {
    if (!this.svgContainerRef) return;

    let svgContent: string;

    if (this.usePagination && this.enablePageSplitting && this.totalPages > 1) {
      // Show single page
      svgContent = this.svgGeneratorService.generateSinglePage(
        formData,
        this.svgConfig,
        this.initialListSections,
        this.currentPage
      );
    } else {
      // Show all pages side-by-side or single page
      svgContent = this.svgGeneratorService.generateSVG(
        formData,
        this.svgConfig,
        this.initialListSections
      );
    }

    this.svgContainerRef.nativeElement.innerHTML = svgContent;
  }
}
