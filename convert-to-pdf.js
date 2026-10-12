const puppeteer = require('/tmp/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

async function convertHtmlToPdf() {
  const htmlPath = path.resolve(__dirname, 'ecoaudit-data-flow-explanation.html');
  const pdfPath = path.resolve(__dirname, 'EcoAudit_NG_Data_Flow_Guide.pdf');
  
  console.log(`HTML file: ${htmlPath}`);
  console.log(`Output PDF: ${pdfPath}`);
  
  if (!fs.existsSync(htmlPath)) {
    console.error(`HTML file not found at: ${htmlPath}`);
    process.exit(1);
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Load the HTML file
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });
    
    console.log(`✅ PDF generated successfully at: ${pdfPath}`);
    
    // Check file size
    const stats = fs.statSync(pdfPath);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`📄 File size: ${fileSizeMB} MB`);
    
  } catch (error) {
    console.error('❌ Failed to generate PDF:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

convertHtmlToPdf();
