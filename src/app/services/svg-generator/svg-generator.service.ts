import { Injectable } from '@angular/core';
import {
  IPersonalInfo,
  IResumeData,
  IExperience,
  IEducation,
  IProject,
  ISkill,
  SKILL_LEVEL,
} from '@models/resume.model';
import { SvgConfig, PageContent } from '@models/svg.model';
import { HtmlToSvgConverter } from '@utils/html-to-svg-converter';

@Injectable({
  providedIn: 'root',
})
export class SvgGeneratorService {
  generateSVG(
    formData: IResumeData,
    config: SvgConfig,
    initialListSections?: any[]
  ): string {
    const pages = this.generatePages(formData, config, initialListSections);

    if (pages.length <= 1 || !config.page.enablePageSplitting) {
      return this.renderSinglePage(
        pages[0] || { content: '', pageNumber: 1 },
        config
      );
    }

    // Return multi-page side-by-side layout
    return this.renderMultiPageLayout(pages, config);
  }

  generateSinglePage(
    formData: IResumeData,
    config: SvgConfig,
    initialListSections?: any[],
    pageNumber: number = 1
  ): string {
    const pages = this.generatePages(formData, config, initialListSections);
    const targetPage = pages[pageNumber - 1];

    if (!targetPage) {
      return this.renderSinglePage({ content: '', pageNumber: 1 }, config);
    }

    return this.renderSinglePage(targetPage, config);
  }

  getTotalPages(
    formData: IResumeData,
    config: SvgConfig,
    initialListSections?: any[]
  ): number {
    const pages = this.generatePages(formData, config, initialListSections);
    return Math.max(1, pages.length);
  }

  private generatePages(
    formData: IResumeData,
    config: SvgConfig,
    initialListSections?: any[]
  ): PageContent[] {
    const { margins } = config.page;

    // Calculate maximum content height per page
    const maxContentHeight = config.page.height - margins.top - margins.bottom;
    const configWithPageSplitting = {
      ...config,
      page: {
        ...config.page,
        maxContentHeight,
        enablePageSplitting: config.page.enablePageSplitting ?? true,
      },
    };

    let pages: PageContent[] = [];
    let currentPageContent = '';
    let currentPageNumber = 1;
    let y = margins.top;

    // Generate Personal Info Section (always on first page)
    const personalInfoResult = this.generatePersonalInfoSection(
      formData.personalInfo,
      y,
      configWithPageSplitting
    );
    currentPageContent += personalInfoResult.content;
    y = personalInfoResult.newY;

    // Generate sections based on initialListSections order
    if (initialListSections) {
      for (const section of initialListSections) {
        const sectionKey = section.formGroupName;
        const sectionHeader = section.header;

        let sectionResult: { content: string; newY: number } | null = null;

        switch (sectionKey) {
          case 'summary':
            if (formData.summary) {
              sectionResult = this.generateSummarySection(
                formData.summary,
                y,
                configWithPageSplitting
              );
            }
            break;

          case 'experience':
            if (formData.experience && formData.experience.length > 0) {
              sectionResult = this.generateExperienceSection(
                formData.experience,
                y,
                configWithPageSplitting,
                sectionHeader
              );
            }
            break;

          case 'skills':
            if (formData.skills && formData.skills.length > 0) {
              sectionResult = this.generateSkillsSection(
                formData.skills,
                y,
                configWithPageSplitting,
                sectionHeader
              );
            }
            break;

          case 'education':
            if (formData.education && formData.education.length > 0) {
              sectionResult = this.generateEducationSection(
                formData.education,
                y,
                configWithPageSplitting,
                sectionHeader
              );
            }
            break;

          case 'projects':
            if (formData.projects && formData.projects.length > 0) {
              sectionResult = this.generateProjectsSection(
                formData.projects,
                y,
                configWithPageSplitting,
                sectionHeader
              );
            }
            break;
        }

        if (sectionResult) {
          // Check if we need to start a new page
          if (
            configWithPageSplitting.page.enablePageSplitting &&
            sectionResult.newY > margins.top + maxContentHeight
          ) {
            // Save current page
            pages.push({
              content: currentPageContent,
              pageNumber: currentPageNumber,
            });

            // Start new page
            currentPageNumber++;
            currentPageContent = '';
            y = margins.top;

            // Regenerate the section for the new page
            switch (sectionKey) {
              case 'summary':
                if (formData.summary) {
                  sectionResult = this.generateSummarySection(
                    formData.summary,
                    y,
                    configWithPageSplitting
                  );
                }
                break;
              case 'experience':
                if (formData.experience && formData.experience.length > 0) {
                  sectionResult = this.generateExperienceSection(
                    formData.experience,
                    y,
                    configWithPageSplitting,
                    sectionHeader
                  );
                }
                break;
              case 'skills':
                if (formData.skills && formData.skills.length > 0) {
                  sectionResult = this.generateSkillsSection(
                    formData.skills,
                    y,
                    configWithPageSplitting,
                    sectionHeader
                  );
                }
                break;
              case 'education':
                if (formData.education && formData.education.length > 0) {
                  sectionResult = this.generateEducationSection(
                    formData.education,
                    y,
                    configWithPageSplitting,
                    sectionHeader
                  );
                }
                break;
              case 'projects':
                if (formData.projects && formData.projects.length > 0) {
                  sectionResult = this.generateProjectsSection(
                    formData.projects,
                    y,
                    configWithPageSplitting,
                    sectionHeader
                  );
                }
                break;
            }
          }

          if (sectionResult) {
            currentPageContent += sectionResult.content;
            y = sectionResult.newY;
          }
        }
      }
    }

    // Add the last page
    if (currentPageContent) {
      pages.push({
        content: currentPageContent,
        pageNumber: currentPageNumber,
      });
    }

    // Process page breaks within content
    let finalPages: PageContent[] = [];
    pages.forEach((page) => {
      const subPages = this.processMultiPageContent(
        page.content,
        configWithPageSplitting
      );
      finalPages = finalPages.concat(
        subPages.map((subPage, index) => ({
          content: subPage.content,
          pageNumber: finalPages.length + index + 1,
        }))
      );
    });

    return finalPages.length > 0
      ? finalPages
      : [{ content: '', pageNumber: 1 }];
  }

  private renderSinglePage(page: PageContent, config: SvgConfig): string {
    const { width, height } = config.page;
    const { family, sizes } = config.fonts;
    const { primary, text, divider } = config.colors;

    const svgDefs = `
      <defs>
        <style>
          .title-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.large}px; }
          .default-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.default}px; }
          .small-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.small}px; }
          .section-divider { stroke: ${divider}; stroke-width: 0.5px; }
        </style>
      </defs>
    `;

    return `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        ${svgDefs}
        ${page.content}
      </svg>
    `;
  }

  private renderMultiPageLayout(
    pages: PageContent[],
    config: SvgConfig
  ): string {
    const { width, height } = config.page;
    const { family, sizes } = config.fonts;
    const { primary, text, divider } = config.colors;

    const svgDefs = `
      <defs>
        <style>
          .title-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.large}px; }
          .default-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.default}px; }
          .small-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.small}px; }
          .section-divider { stroke: ${divider}; stroke-width: 0.5px; }
        </style>
      </defs>
    `;

    // Generate multi-page SVG with pages side by side
    const totalWidth = width * pages.length;
    let multiPageContent = '';

    pages.forEach((page, index) => {
      const xOffset = width * index;
      multiPageContent += `
        <g transform="translate(${xOffset}, 0)">
          ${page.content}

          <!-- Page boundary line -->
          ${
            index < pages.length - 1
              ? `
            <line
              x1="${width - 1}"
              y1="0"
              x2="${width - 1}"
              y2="${height}"
              stroke="#e0e0e0"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
          `
              : ''
          }
        </g>
      `;
    });

    return `
      <svg viewBox="0 0 ${totalWidth} ${height}" xmlns="http://www.w3.org/2000/svg">
        ${svgDefs}
        ${multiPageContent}
      </svg>
    `;
  }

  private generatePersonalInfoSection(
    personalInfo: IPersonalInfo | undefined,
    y: number,
    config: SvgConfig
  ): { content: string; newY: number } {
    if (!personalInfo) return { content: '', newY: y };

    let content = '';
    let newY = y;
    const { margins } = config.page;
    const { sizes, lineHeights } = config.fonts;
    const { sectionGap, lineGap } = config.spacing;

    const {
      firstName,
      lastName,
      jobTitle,
      email,
      phone,
      address,
      city,
      country,
    } = personalInfo;

    const leftX = margins.left;
    const rightX = 210 - margins.right; // 210 is A4 width in mm
    let currY = newY;

    // Center jobTitle if present
    if (jobTitle) {
      content += `
        <text
          x="${leftX + (rightX - leftX) / 2}"
          y="${currY + sizes.default}"
          class="default-text"
          font-style="italic"
          text-anchor="middle"
        >${jobTitle}</text>
      `;
      currY += sizes.default * lineHeights.default + lineGap;
    }

    // Center fullName
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    content += `
      <text
        x="${leftX + (rightX - leftX) / 2}"
        y="${currY + sizes.large}"
        class="title-text"
        font-weight="bold"
        text-anchor="middle"
      >${fullName}</text>
    `;
    currY += sizes.large * lineHeights.large + lineGap;

    // Contact info
    const contactLines: string[] = [];
    if (email) contactLines.push(email);
    if (phone) contactLines.push(phone);

    const addressParts = [address, city, country].filter(Boolean).join(', ');
    if (addressParts) contactLines.push(addressParts);

    content += `
      <text
        x="${leftX}"
        y="${currY + sizes.small}"
        class="default-text"
      >${contactLines.join(' | ')}</text>
    `;
    currY += sizes.small * lineHeights.small;

    // Divider line after personal info
    currY += sectionGap;
    content += `
      <line
        x1="${leftX}"
        y1="${currY}"
        x2="${rightX}"
        y2="${currY}"
        class="section-divider"
      />
    `;
    currY += lineGap;

    return { content, newY: currY };
  }

  private generateSummarySection(
    summary: any,
    y: number,
    config: SvgConfig
  ): { content: string; newY: number } {
    let content = '';
    let newY = y;
    const { margins } = config.page;
    const { family, sizes, lineHeights } = config.fonts;
    const { text, primary } = config.colors;
    const { sectionGap, lineGap } = config.spacing;

    const leftX = margins.left;
    const rightX = 210 - margins.right;
    let currY = newY;

    // Add section title
    content += `
      <text
        x="${leftX}"
        y="${currY + sizes.large}"
        class="title-text"
        font-weight="bold"
        fill="${primary}"
      >Summary</text>
    `;
    currY += sizes.large * lineHeights.large + lineGap;

    // Parse HTML content
    if (summary) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(summary, 'text/html');
      const body = doc.body;

      // Process each child element using HtmlToSvgConverter
      const htmlToSvgConverter = new HtmlToSvgConverter();
      const svgElements = htmlToSvgConverter.convertHtmlToSvg(
        body,
        leftX,
        currY,
        rightX - leftX,
        {
          fontFamily: family,
          fontSize: sizes.default,
          lineHeight: lineHeights.default,
          color: text,
        }
      );

      content += svgElements.content;
      currY = svgElements.newY;
    }

    // Add divider line
    currY += sectionGap;
    content += `
      <line
        x1="${leftX}"
        y1="${currY}"
        x2="${rightX}"
        y2="${currY}"
        class="section-divider"
      />
    `;
    currY += lineGap;

    return { content, newY: currY };
  }

  private generateExperienceSection(
    experience: IExperience[],
    y: number,
    config: SvgConfig,
    sectionHeader: string
  ): { content: string; newY: number } {
    let content = '';
    let newY = y;
    const { margins } = config.page;
    const { family, sizes, lineHeights } = config.fonts;
    const { text, primary } = config.colors;
    const { sectionGap, lineGap, elementGap } = config.spacing;

    const leftX = margins.left;
    const rightX = 210 - margins.right;
    let currY = newY;

    // Section title
    content += `
      <text
        x="${leftX}"
        y="${currY + sizes.large}"
        class="title-text"
        font-weight="bold"
        fill="${primary}"
      >${sectionHeader}</text>
    `;
    currY += sizes.large * lineHeights.large + lineGap;

    // Experience entries
    experience.forEach((exp, index) => {
      // Check if we need space for this entry (estimate minimum height)
      const estimatedEntryHeight = this.estimateExperienceEntryHeight(
        exp,
        config
      );

      if (
        config.page.enablePageSplitting &&
        config.page.maxContentHeight &&
        currY + estimatedEntryHeight >
          margins.top + config.page.maxContentHeight
      ) {
        // Add page break indicator
        content += `
          <!-- PAGE_BREAK -->
        `;
        currY = margins.top;

        // Add section header again on new page
        content += `
          <text
            x="${leftX}"
            y="${currY + sizes.large}"
            class="title-text"
            font-weight="bold"
            fill="${primary}"
          >${sectionHeader} (continued)</text>
        `;
        currY += sizes.large * lineHeights.large + lineGap;
      }

      // Job title and company
      const jobInfo = [exp.jobTitle, exp.company].filter(Boolean).join(' at ');
      if (jobInfo) {
        content += `
          <text
            x="${leftX}"
            y="${currY + sizes.default}"
            class="default-text"
            font-weight="bold"
          >${this.escapeXml(jobInfo)}</text>
        `;
        currY += sizes.default * lineHeights.default + lineGap / 2;
      }

      // Location and dates
      const locationInfo = exp.city || '';
      const dateInfo = this.formatDateRange(exp.startDate, exp.endDate);

      if (locationInfo || dateInfo) {
        const locationDateInfo = [locationInfo, dateInfo]
          .filter(Boolean)
          .join(' | ');
        content += `
          <text
            x="${leftX}"
            y="${currY + sizes.small}"
            class="default-text"
            font-style="italic"
          >${this.escapeXml(locationDateInfo)}</text>
        `;
        currY += sizes.small * lineHeights.small + lineGap;
      }

      // Description
      if (exp.description) {
        const htmlToSvgConverter = new HtmlToSvgConverter();
        const parser = new DOMParser();
        const doc = parser.parseFromString(exp.description, 'text/html');

        const svgElements = htmlToSvgConverter.convertHtmlToSvg(
          doc.body,
          leftX,
          currY,
          rightX - leftX,
          {
            fontFamily: family,
            fontSize: sizes.default,
            lineHeight: lineHeights.default,
            color: text,
          }
        );

        content += svgElements.content;
        currY = svgElements.newY;
      }

      // Add spacing between entries
      if (index < experience.length - 1) {
        currY += elementGap;
      }
    });

    // Add divider line
    currY += sectionGap;
    content += `
      <line
        x1="${leftX}"
        y1="${currY}"
        x2="${rightX}"
        y2="${currY}"
        class="section-divider"
      />
    `;
    currY += lineGap;

    return { content, newY: currY };
  }

  private estimateExperienceEntryHeight(
    exp: IExperience,
    config: SvgConfig
  ): number {
    const { sizes, lineHeights } = config.fonts;
    const { lineGap, elementGap } = config.spacing;

    let estimatedHeight = 0;

    // Job title and company
    if (exp.jobTitle || exp.company) {
      estimatedHeight += sizes.default * lineHeights.default + lineGap / 2;
    }

    // Location and dates
    if (exp.city || exp.startDate || exp.endDate) {
      estimatedHeight += sizes.small * lineHeights.small + lineGap;
    }

    // Description (estimate based on character count)
    if (exp.description) {
      const charCount = exp.description.length;
      const estimatedLines = Math.ceil(charCount / 80); // Rough estimate
      estimatedHeight += estimatedLines * sizes.small * lineHeights.small;
    }

    estimatedHeight += elementGap; // Spacing after entry

    return estimatedHeight;
  }

  private processMultiPageContent(
    content: string,
    config: SvgConfig
  ): PageContent[] {
    const pages: PageContent[] = [];
    const pageBreaks = content.split('<!-- PAGE_BREAK -->');

    pageBreaks.forEach((pageContent, index) => {
      if (pageContent.trim()) {
        pages.push({
          content: pageContent.trim(),
          pageNumber: index + 1,
        });
      }
    });

    return pages.length > 0 ? pages : [{ content, pageNumber: 1 }];
  }

  private generateSkillsSection(
    skills: ISkill[],
    y: number,
    config: SvgConfig,
    sectionHeader: string
  ): { content: string; newY: number } {
    let content = '';
    let newY = y;
    const { margins } = config.page;
    const { family, sizes, lineHeights } = config.fonts;
    const { text, primary } = config.colors;
    const { sectionGap, lineGap } = config.spacing;

    const leftX = margins.left;
    const rightX = 210 - margins.right;
    let currY = newY;

    // Section title
    content += `
      <text
        x="${leftX}"
        y="${currY + sizes.large}"
        class="title-text"
        font-weight="bold"
        fill="${primary}"
      >${sectionHeader}</text>
    `;
    currY += sizes.large * lineHeights.large + lineGap;

    // Group skills by level or display as list
    skills.forEach((skill) => {
      let skillText = skill.name;
      if (skill.level && skill.level !== SKILL_LEVEL.NOVICE) {
        skillText += ` (${skill.level})`;
      }
      if (skill.name) {
        content += `
          <text
            x="${leftX}"
            y="${currY + sizes.default}"
            class="default-text"
          >${this.escapeXml(skillText ?? '')}</text>
        `;
        currY += sizes.default * lineHeights.default;
      }
    });

    // Add divider line
    currY += sectionGap;
    content += `
      <line
        x1="${leftX}"
        y1="${currY}"
        x2="${rightX}"
        y2="${currY}"
        class="section-divider"
      />
    `;
    currY += lineGap;

    return { content, newY: currY };
  }

  private generateEducationSection(
    education: IEducation[],
    y: number,
    config: SvgConfig,
    sectionHeader: string
  ): { content: string; newY: number } {
    let content = '';
    let newY = y;
    const { margins } = config.page;
    const { family, sizes, lineHeights } = config.fonts;
    const { text, primary } = config.colors;
    const { sectionGap, lineGap, elementGap } = config.spacing;

    const leftX = margins.left;
    const rightX = 210 - margins.right;
    let currY = newY;

    // Section title
    content += `
      <text
        x="${leftX}"
        y="${currY + sizes.large}"
        class="title-text"
        font-weight="bold"
        fill="${primary}"
      >${sectionHeader}</text>
    `;
    currY += sizes.large * lineHeights.large + lineGap;

    // Education entries
    education.forEach((edu, index) => {
      // Degree and school
      const degreeInfo = [edu.degree, edu.school].filter(Boolean).join(' - ');
      if (degreeInfo) {
        content += `
          <text
            x="${leftX}"
            y="${currY + sizes.default}"
            class="default-text"
            font-weight="bold"
          >${this.escapeXml(degreeInfo)}</text>
        `;
        currY += sizes.default * lineHeights.default + lineGap / 2;
      }

      // Location and dates
      const locationInfo = edu.city || '';
      const dateInfo = this.formatDateRange(edu.startDate, edu.endDate);

      if (locationInfo || dateInfo) {
        const locationDateInfo = [locationInfo, dateInfo]
          .filter(Boolean)
          .join(' | ');
        content += `
          <text
            x="${leftX}"
            y="${currY + sizes.default}"
            class="default-text"
            font-style="italic"
          >${this.escapeXml(locationDateInfo)}</text>
        `;
        currY += sizes.default * lineHeights.default + lineGap;
      }

      // Description
      if (edu.description) {
        const htmlToSvgConverter = new HtmlToSvgConverter();
        const parser = new DOMParser();
        const doc = parser.parseFromString(edu.description, 'text/html');

        const svgElements = htmlToSvgConverter.convertHtmlToSvg(
          doc.body,
          leftX,
          currY,
          rightX - leftX,
          {
            fontFamily: family,
            fontSize: sizes.default,
            lineHeight: lineHeights.default,
            color: text,
          }
        );

        content += svgElements.content;
        currY = svgElements.newY;
      }

      // Add spacing between entries
      if (index < education.length - 1) {
        currY += elementGap;
      }
    });

    // Add divider line
    currY += sectionGap;
    content += `
      <line
        x1="${leftX}"
        y1="${currY}"
        x2="${rightX}"
        y2="${currY}"
        class="section-divider"
      />
    `;
    currY += lineGap;

    return { content, newY: currY };
  }

  private generateProjectsSection(
    projects: IProject[],
    y: number,
    config: SvgConfig,
    sectionHeader: string
  ): { content: string; newY: number } {
    let content = '';
    let newY = y;
    const { margins } = config.page;
    const { family, sizes, lineHeights } = config.fonts;
    const { text, primary } = config.colors;
    const { sectionGap, lineGap, elementGap } = config.spacing;

    const leftX = margins.left;
    const rightX = 210 - margins.right;
    let currY = newY;

    // Section title
    content += `
      <text
        x="${leftX}"
        y="${currY + sizes.large}"
        class="title-text"
        font-weight="bold"
        fill="${primary}"
      >${sectionHeader}</text>
    `;
    currY += sizes.large * lineHeights.large + lineGap;

    // Project entries
    projects.forEach((project, index) => {
      // Project name
      if (project.name) {
        content += `
          <text
            x="${leftX}"
            y="${currY + sizes.default}"
            class="default-text"
            font-weight="bold"
          >${this.escapeXml(project.name)}</text>
        `;
        currY += sizes.default * lineHeights.default + lineGap / 2;
      }

      // Location and dates
      const locationInfo = project.city || '';
      const dateInfo = this.formatDateRange(project.startDate, project.endDate);

      if (locationInfo || dateInfo) {
        const locationDateInfo = [locationInfo, dateInfo]
          .filter(Boolean)
          .join(' | ');
        content += `
          <text
            x="${leftX}"
            y="${currY + sizes.default}"
            class="default-text"
            font-style="italic"
          >${this.escapeXml(locationDateInfo)}</text>
        `;
        currY += sizes.default * lineHeights.default + lineGap;
      }

      // Description
      if (project.description) {
        const htmlToSvgConverter = new HtmlToSvgConverter();
        const parser = new DOMParser();
        const doc = parser.parseFromString(project.description, 'text/html');

        const svgElements = htmlToSvgConverter.convertHtmlToSvg(
          doc.body,
          leftX,
          currY,
          rightX - leftX,
          {
            fontFamily: family,
            fontSize: sizes.default,
            lineHeight: lineHeights.default,
            color: text,
          }
        );

        content += svgElements.content;
        currY = svgElements.newY;
      }

      // Add spacing between entries
      if (index < projects.length - 1) {
        currY += elementGap;
      }
    });

    // Add divider line
    currY += sectionGap;
    content += `
      <line
        x1="${leftX}"
        y1="${currY}"
        x2="${rightX}"
        y2="${currY}"
        class="section-divider"
      />
    `;
    currY += lineGap;

    return { content, newY: currY };
  }

  private formatDateRange(
    startDate?: Date | null,
    endDate?: Date | null
  ): string {
    if (!startDate && !endDate) return '';

    const formatDate = (date: Date | null | undefined) => {
      if (!date) return '';
      return date instanceof Date
        ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
    };

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';

    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    if (end && end !== 'Present') return end;

    return '';
  }

  private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = this.getTextWidth(testLine, fontSize);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length ? lines : [''];
  }

  private getTextWidth(text: string, fontSize: number): number {
    return text.length * fontSize * 0.6;
  }

  private escapeXml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
