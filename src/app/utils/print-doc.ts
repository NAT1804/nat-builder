export function printResume(svgElement: any) {
  if (!svgElement) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume</title>
          <style>
            body { margin: 0; padding: 20px; }
            svg { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          ${svgData}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
