import { Injectable } from '@angular/core';
import { IPersonalInfo, IResumeData } from '@models/resume.model';

export interface SvgConfig {
  page: {
    width: number;
    height: number;
    margins: { top: number; right: number; bottom: number; left: number };
  };
  fonts: {
    family: string;
    sizes: {
      small: number;
      default: number;
      large: number;
    };
    lineHeights: {
      small: number;
      default: number;
      large: number;
    };
  };
  colors: {
    primary: string;
    text: string;
    divider: string;
  };
  spacing: {
    sectionGap: number;
    elementGap: number;
    lineGap: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SvgGeneratorService {
  generateSVG(formData: IResumeData, config: SvgConfig): string {
    const { width, height, margins } = config.page;
    const { family, sizes } = config.fonts;
    const { primary, text, divider } = config.colors;

    let svgContent = `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .title-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.large}px; }
            .default-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.default}px; }
            .small-text { fill: ${text}; font-family: ${family}; font-size: ${sizes.small}px; }
            .section-divider { stroke: ${divider}; stroke-width: 0.5px; }
          </style>
        </defs>
    `;

    let y = margins.top;

    // Generate Personal Info Section
    const personalInfoResult = this.generatePersonalInfoSection(
      formData.personalInfo,
      y,
      config
    );
    svgContent += personalInfoResult.content;
    y = personalInfoResult.newY;

    // Generate Summary Section
    if (formData.summary) {
      const summaryResult = this.generateSummarySection(
        formData.summary,
        y,
        config
      );
      svgContent += summaryResult.content;
      y = summaryResult.newY;
    }

    svgContent += '</svg>';
    return svgContent;
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
    content += `
      <line
        x1="${leftX}"
        y1="${currY}"
        x2="${rightX}"
        y2="${currY}"
        class="section-divider"
      />
    `;
    currY += lineGap * 2;

    return { content, newY: currY + sectionGap };
  }
}

// Helper class for HTML to SVG conversion
export class HtmlToSvgConverter {
  convertHtmlToSvg(
    element: Element,
    x: number,
    y: number,
    maxWidth: number,
    options: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      color: string;
    }
  ): { content: string; newY: number } {
    let content = '';
    let currY = y;
    const { fontFamily, fontSize, lineHeight, color } = options;

    // Process each child node
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          const lines = this.wrapText(text, maxWidth, fontSize);
          lines.forEach((line, index) => {
            content += `
              <text
                x="${x}"
                y="${currY + fontSize}"
                font-family="${fontFamily}"
                font-size="${fontSize}"
                fill="${color}"
              >${this.escapeXml(line)}</text>
            `;
            currY += fontSize * lineHeight;
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as Element;
        const tagName = elem.tagName.toLowerCase();

        switch (tagName) {
          case 'p':
            const pResult = this.processParagraph(
              elem,
              x,
              currY,
              maxWidth,
              options
            );
            content += pResult.content;
            currY = pResult.newY + fontSize * 0.5;
            break;

          case 'ol':
          case 'ul':
            const listResult = this.processList(
              elem,
              x,
              currY,
              maxWidth,
              options,
              tagName === 'ol'
            );
            content += listResult.content;
            currY = listResult.newY + fontSize * 0.5;
            break;

          default:
            const inlineResult = this.processInlineElement(
              elem,
              x,
              currY,
              maxWidth,
              options
            );
            content += inlineResult.content;
            currY = inlineResult.newY;
        }
      }
    }

    return { content, newY: currY };
  }

  private processParagraph(
    elem: Element,
    x: number,
    y: number,
    maxWidth: number,
    options: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      color: string;
    }
  ): { content: string; newY: number } {
    let content = '';
    let currY = y;
    const { fontFamily, fontSize, lineHeight, color } = options;

    const formattedText = this.extractFormattedText(elem);

    if (!formattedText.length) {
      return { content, newY: currY + fontSize * lineHeight };
    }

    let currentLineSegments: Array<{ segment: any; text: string }> = [];
    let currentLineWidth = 0;

    formattedText.forEach((segment) => {
      const words = segment.text.split(' ');
      let currentSegmentText = '';

      words.forEach((word, wordIndex) => {
        const wordWithSpace = wordIndex > 0 ? ` ${word}` : word;
        const wordWidth = this.getTextWidth(wordWithSpace, fontSize);

        if (
          currentLineWidth + wordWidth > maxWidth &&
          currentLineSegments.length > 0
        ) {
          if (currentSegmentText) {
            currentLineSegments.push({
              segment: { ...segment },
              text: currentSegmentText,
            });
          }
          content += this.renderFormattedLine(
            currentLineSegments,
            x,
            currY + fontSize,
            fontFamily,
            fontSize,
            color
          );
          currY += fontSize * lineHeight;

          currentLineSegments = [];
          currentLineWidth = 0;
          currentSegmentText = word;
          currentLineWidth = this.getTextWidth(word, fontSize);
        } else {
          currentSegmentText += wordWithSpace;
          currentLineWidth += wordWidth;
        }
      });

      if (currentSegmentText) {
        currentLineSegments.push({
          segment: { ...segment },
          text: currentSegmentText,
        });
      }
    });

    if (currentLineSegments.length > 0) {
      content += this.renderFormattedLine(
        currentLineSegments,
        x,
        currY + fontSize,
        fontFamily,
        fontSize,
        color
      );
      currY += fontSize * lineHeight;
    }

    return { content, newY: currY };
  }

  private renderFormattedLine(
    lineSegments: Array<{ segment: any; text: string }>,
    x: number,
    y: number,
    fontFamily: string,
    fontSize: number,
    color: string
  ): string {
    let content = '';
    let currentX = x;

    lineSegments.forEach((item) => {
      const { segment, text } = item;
      const trimmedText = text.trim();
      if (!trimmedText) return;

      let textElement = `
        <text
          x="${currentX}"
          y="${y}"
          font-family="${fontFamily}"
          font-size="${fontSize}"
          fill="${color}"
      `;

      if (segment.bold) textElement += ` font-weight="bold"`;
      if (segment.italic) textElement += ` font-style="italic"`;

      textElement += `>`;

      if (segment.underline || segment.strikethrough) {
        textElement += `<tspan`;
        if (segment.underline) textElement += ` text-decoration="underline"`;
        if (segment.strikethrough)
          textElement += ` text-decoration="line-through"`;
        textElement += `>${this.escapeXml(trimmedText)}</tspan>`;
      } else {
        textElement += this.escapeXml(trimmedText);
      }

      textElement += `</text>`;
      content += textElement;

      currentX += this.getTextWidth(text, fontSize);
    });

    return content;
  }

  private processList(
    elem: Element,
    x: number,
    y: number,
    maxWidth: number,
    options: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      color: string;
    },
    isOrdered: boolean
  ): { content: string; newY: number } {
    let content = '';
    let currY = y;
    const { fontFamily, fontSize, lineHeight, color } = options;
    const listItems = elem.querySelectorAll('li');
    const indentX = x + fontSize * 2;

    listItems.forEach((li, index) => {
      const marker = isOrdered ? `${index + 1}.` : '•';
      content += `
        <text
          x="${x}"
          y="${currY + fontSize}"
          font-family="${fontFamily}"
          font-size="${fontSize}"
          fill="${color}"
        >${marker}</text>
      `;

      const formattedText = this.extractFormattedText(li);
      let lineX = indentX;
      let isNewLine = false;

      formattedText.forEach((segment, segmentIndex) => {
        const availableWidth = isNewLine
          ? maxWidth - (indentX - x)
          : maxWidth - (lineX - x);
        const lines = this.wrapText(segment.text, availableWidth, fontSize);

        lines.forEach((line, lineIndex) => {
          if (lineIndex > 0 || isNewLine) {
            lineX = indentX;
            if (lineIndex > 0 || (isNewLine && segmentIndex > 0)) {
              currY += fontSize * lineHeight;
            }
          }

          let textElement = `
            <text
              x="${lineX}"
              y="${currY + fontSize}"
              font-family="${fontFamily}"
              font-size="${fontSize}"
              fill="${color}"
          `;

          if (segment.bold) textElement += ` font-weight="bold"`;
          if (segment.italic) textElement += ` font-style="italic"`;

          textElement += `>`;

          if (segment.underline || segment.strikethrough) {
            textElement += `<tspan`;
            if (segment.underline)
              textElement += ` text-decoration="underline"`;
            if (segment.strikethrough)
              textElement += ` text-decoration="line-through"`;
            textElement += `>${this.escapeXml(line)}</tspan>`;
          } else {
            textElement += this.escapeXml(line);
          }

          textElement += `</text>`;
          content += textElement;

          if (lineIndex === lines.length - 1) {
            lineX += this.getTextWidth(line, fontSize);
            isNewLine = false;
          } else {
            isNewLine = true;
          }
        });
      });

      currY += fontSize * lineHeight;
    });

    return { content, newY: currY };
  }

  private processInlineElement(
    elem: Element,
    x: number,
    y: number,
    maxWidth: number,
    options: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      color: string;
    }
  ): { content: string; newY: number } {
    const formattedText = this.extractFormattedText(elem);
    let content = '';
    let currY = y;

    formattedText.forEach((segment) => {
      const pResult = this.processParagraph(
        this.createParagraphElement(segment.text),
        x,
        currY,
        maxWidth,
        options
      );
      content += pResult.content;
      currY = pResult.newY;
    });

    return { content, newY: currY };
  }

  private extractFormattedText(elem: Element): Array<{
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
  }> {
    const segments: Array<{
      text: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
    }> = [];

    const processNode = (
      node: Node,
      formatting: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strikethrough?: boolean;
      } = {}
    ) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          segments.push({ text, ...formatting });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as Element;
        const tagName = elem.tagName.toLowerCase();
        const newFormatting = { ...formatting };

        switch (tagName) {
          case 'strong':
          case 'b':
            newFormatting.bold = true;
            break;
          case 'em':
          case 'i':
            newFormatting.italic = true;
            break;
          case 'u':
            newFormatting.underline = true;
            break;
          case 's':
          case 'strike':
            newFormatting.strikethrough = true;
            break;
        }

        elem.childNodes.forEach((child) => processNode(child, newFormatting));
      }
    };

    elem.childNodes.forEach((child) => processNode(child));
    return segments;
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
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private createParagraphElement(text: string): Element {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
  }
}
