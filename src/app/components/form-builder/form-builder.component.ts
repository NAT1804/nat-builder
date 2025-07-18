import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IResumeData } from '@models/resume.model';
import { exportToPdf } from '@utils/export-pdf';
import { printResume } from '@utils/print-doc';
import { NG_ZORRO_MODULES } from '../../shared/ng-zorro.module';
import { FormDataEntryComponent } from './form-data-entry/form-data-entry.component';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
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
      'I am a software engineer with a passion for building web applications.',
    projects: [],
    experience: [],
    education: [],
    skills: [],
  };

  onFormDataChange(formData: IResumeData) {
    this.updatePreview(formData);
  }

  // SVG preview methods
  private updatePreview(formData: any) {
    if (!this.svgContainerRef) return;

    const svgContent = this.generateSVG(formData);
    this.svgContainerRef.nativeElement.innerHTML = svgContent;
  }

  private generateSVG(formData: IResumeData): string {
    // A4 dimensions in mm: 210 x 297
    const width = 210;
    const height = 297;

    let svgContent = `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .header-bg { fill: #2c3e50; }
            .name-text { fill: #000000; font-family: Arial, sans-serif; font-size: 8px; font-weight: bold; text-anchor: middle; }
            .contact-text { fill: #000000; font-family: Arial, sans-serif; font-size: 3.5px; text-anchor: middle; }
            .section-title { fill: #2c3e50; font-family: Arial, sans-serif; font-size: 5px; font-weight: bold; }
            .job-title { fill: #2c3e50; font-family: Arial, sans-serif; font-size: 4.5px; font-weight: bold; }
            .company-name { fill: #7f8c8d; font-family: Arial, sans-serif; font-size: 3.5px; }
            .body-text { fill: #333333; font-family: Arial, sans-serif; font-size: 3px; }
            .skill-name { fill: #2c3e50; font-family: Arial, sans-serif; font-size: 3px; }
            .section-divider { stroke: #2c3e50; stroke-width: 0.5px; }
            .skill-bar-bg { fill: #ecf0f1; }
            .skill-bar-fill { fill: #3498db; }
          </style>
        </defs>
    `;

    let y = 15;

    // Header
    svgContent += `<text class="name-text" x="${width / 2}" y="${y}">${
      formData.personalInfo?.firstName +
        ' ' +
        formData.personalInfo?.lastName || 'Your Name'
    }</text>`;
    svgContent += `<text class="contact-text" x="${width / 2}" y="${y + 7}">${
      formData.personalInfo?.email || 'email@example.com'
    } | ${formData.personalInfo?.phone || 'Phone'}</text>`;

    y = 40;

    // Summary
    if (formData.summary) {
      svgContent += this.generateSectionTitle('Summary', y);
      y += 4;
      svgContent += this.generateWrappedText(
        formData.summary,
        10,
        y,
        width - 20,
        4
      );
      y += this.getTextHeight(formData.summary, width - 20, 4) + 5;
    }

    // Experience
    if (formData.experience && formData.experience.length > 0) {
      svgContent += this.generateSectionTitle('Work Experience', y);
      y += 8;

      formData.experience.forEach((exp: any) => {
        if (exp.company) {
          svgContent += `<text class="job-title" x="10" y="${y}">${exp.position}</text>`;
          svgContent += `<text class="company-name" x="10" y="${y + 4}">${
            exp.company
          }</text>`;
          y += 10;

          if (exp.description) {
            svgContent += this.generateWrappedText(
              exp.description,
              10,
              y,
              width - 20,
              4
            );
            y += this.getTextHeight(exp.description, width - 20, 4) + 3;
          }
        }
      });
      y += 5;
    }

    // Education
    if (formData.education && formData.education.length > 0) {
      svgContent += this.generateSectionTitle('Education', y);
      y += 8;

      formData.education.forEach((edu: any) => {
        if (edu.institution) {
          svgContent += `<text class="job-title" x="10" y="${y}">${edu.degree}</text>`;
          svgContent += `<text class="company-name" x="10" y="${y + 4}">${
            edu.institution
          }</text>`;
          y += 10;
        }
      });
      y += 5;
    }

    // Skills
    if (formData.skills && formData.skills.length > 0) {
      svgContent += this.generateSectionTitle('Skills', y);
      y += 8;

      formData.skills.forEach((skill: any) => {
        if (skill.name) {
          svgContent += `<text class="skill-name" x="10" y="${y}">${skill.name}</text>`;

          // Skill bar
          const skillLevel = skill.level || 0;
          const barWidth = 25;
          const barHeight = 2;
          const barX = 50;
          const barY = y - 1.5;

          svgContent += `<rect class="skill-bar-bg" x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}"/>`;
          svgContent += `<rect class="skill-bar-fill" x="${barX}" y="${barY}" width="${
            (skillLevel / 100) * barWidth
          }" height="${barHeight}"/>`;

          y += 6;
        }
      });
    }

    svgContent += '</svg>';
    return svgContent;
  }

  private generateSectionTitle(title: string, y: number): string {
    return `
      <line class="section-divider" x1="10" y1="${y - 8}" x2="200" y2="${
      y - 8
    }"/>
      <text class="section-title" x="10" y="${y}">${title}</text>
    `;
  }

  private generateWrappedText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): string {
    const words = text.split(' ');
    let line = '';
    let lines = 0;
    let svgText = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = this.getTextWidth(testLine, '3mm Arial');

      if (testWidth > maxWidth && n > 0) {
        svgText += `<text class="body-text" x="${x}" y="${
          y + lines * lineHeight
        }">${line.trim()}</text>`;
        line = words[n] + ' ';
        lines++;
      } else {
        line = testLine;
      }
    }
    svgText += `<text class="body-text" x="${x}" y="${
      y + lines * lineHeight
    }">${line.trim()}</text>`;
    return svgText;
  }

  private getTextWidth(text: string, font: string): number {
    // Approximate text width calculation for A4 scale
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      return context.measureText(text).width;
    }
    // Fallback approximation for A4 scale
    return text.length * 1.5;
  }

  private getTextHeight(
    text: string,
    maxWidth: number,
    lineHeight: number
  ): number {
    const words = text.split(' ');
    let line = '';
    let lines = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = this.getTextWidth(testLine, '3mm Arial');

      if (testWidth > maxWidth && n > 0) {
        line = words[n] + ' ';
        lines++;
      } else {
        line = testLine;
      }
    }
    return (lines + 1) * lineHeight;
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
}
