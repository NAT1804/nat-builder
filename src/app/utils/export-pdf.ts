import { jsPDF, jsPDFOptions } from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';

export function exportToPdf(
  svgEl: any,
  pdfName: string,
  jsPDFOptions?: jsPDFOptions
): void {
  if (!svgEl) return;

  const defaultOptions: jsPDFOptions = {
    orientation: 'portrait',
    unit: 'mm',
    format: [svgEl.clientWidth, svgEl.clientHeight],
  };

  const pdf = new jsPDF(jsPDFOptions ?? defaultOptions);

  svg2pdf(svgEl, pdf, {
    x: 0,
    y: 0,
    width: svgEl.clientWidth,
    height: svgEl.clientHeight,
  }).then(() => {
    pdf.save(pdfName);
  });
}
