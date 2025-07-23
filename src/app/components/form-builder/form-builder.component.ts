import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DEFAULT_RESUME_LIST_SECTIONS,
  IResumeData,
} from '@models/resume.model';
import { exportToPdf } from '@utils/export-pdf';
import { printResume } from '@utils/print-doc';
import { FontConfigService } from '@services/font-config/font-config.service';
import {
  SvgGeneratorService,
  SvgConfig,
} from '@services/svg-generator/svg-generator.service';
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
    summary: '',
    projects: [],
    experience: [],
    education: [],
    skills: [],
  };

  constructor() {
    this.currentFormData = this.defaultResumeForm;
  }

  onFormDataChange(formData: IResumeData) {
    this.currentFormData = formData;
    this.updatePreview(formData);
  }

  onListSectionsChange(listSections: any) {
    this.initialListSections = listSections;
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
    this.updatePreview(this.currentFormData);
  }

  // SVG preview methods
  private updatePreview(formData: any) {
    if (!this.svgContainerRef) return;
    const svgContent = this.svgGeneratorService.generateSVG(
      formData,
      this.svgConfig
    );
    this.svgContainerRef.nativeElement.innerHTML = svgContent;
  }
}
