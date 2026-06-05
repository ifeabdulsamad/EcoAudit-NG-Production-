import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { formatDate } from "./formatters.js";

export async function exportPdf(elementId, businessName) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Dashboard element not found");
  }

  try {
    // Capture the dashboard as a high-quality PNG image
    // html-to-image handles SVG content (like Recharts) natively
    const dataUrl = await toPng(element, {
      backgroundColor: "#18181b",
      pixelRatio: 2,
      cacheBust: true,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Create a temporary Image to calculate dimensions
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    // Fill full page width; height scales proportionally and overflows to multiple pages
    const renderWidth = pdfWidth;
    const renderHeight = (img.height * pdfWidth) / img.width;

    let heightLeft = renderHeight;

    let position = 0;

    // Add first page
    pdf.addImage(dataUrl, "PNG", 0, position, renderWidth, renderHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages if content overflows
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, "PNG", 0, position, renderWidth, renderHeight);
      heightLeft -= pdfHeight;
    }

    const sanitizedName = (businessName || "Business").replace(
      /[^a-zA-Z0-9]/g,
      "_",
    );
    const filename = `EcoAudit-${sanitizedName}-${formatDate()}.pdf`;
    pdf.save(filename);
  } catch (err) {
    console.error("PDF export failed:", err);
    throw err;
  }
}
