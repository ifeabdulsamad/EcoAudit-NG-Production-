import { jsPDF } from "jspdf";
import { formatDate } from "./formatters.js";

// Fallback PDF export using html2canvas with CSS sanitization
async function captureWithHtml2canvas(element) {
  const html2canvas = (await import("html2canvas")).default;
  
  // Create a clean clone without Tailwind classes
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 1200px;
    background: #18181b;
    color: #ffffff;
    padding: 40px;
    font-family: system-ui, -apple-system, sans-serif;
    z-index: -1;
  `;
  
  // Clone and strip classes
  const clone = element.cloneNode(true);
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    el.removeAttribute('class');
    // Keep only basic structural styles
    const tag = el.tagName.toLowerCase();
    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      el.style.cssText = 'color: #ffffff; margin: 0 0 16px 0; font-weight: bold;';
    } else if (tag === 'p' || tag === 'span') {
      el.style.cssText = 'color: #a1a1aa; margin: 0;';
    } else if (tag === 'div') {
      el.style.cssText = 'background: transparent; color: #ffffff;';
    } else if (tag === 'svg') {
      el.style.cssText = 'color: #10b981;';
    }
  });
  
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  
  try {
    const canvas = await html2canvas(wrapper, {
      backgroundColor: "#18181b",
      scale: 2,
      useCORS: true,
      logging: false,
      width: 1200,
      windowWidth: 1200,
    });
    return canvas;
  } finally {
    document.body.removeChild(wrapper);
  }
}

export async function exportPdf(elementId, businessName) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn("Dashboard element not found for PDF export");
    return;
  }

  try {
    const canvas = await captureWithHtml2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    const sanitizedName = (businessName || "Business").replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `EcoAudit-${sanitizedName}-${formatDate()}.pdf`;
    pdf.save(filename);
  } catch (err) {
    console.warn("PDF export failed:", err.message);
    throw err;
  }
}
