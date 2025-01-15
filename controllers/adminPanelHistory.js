const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const adminHisModel = require('../models/adminPanelHistory');
const adminHisBackupModel = require('../models/adminPanalBackupPdf');

// Generate PDF with a table for admin history backup
exports.generateArrayPDFForAdminHistoryBackup = async () => {
  try {
    // Fetch data
    const data = await adminHisModel.find();

    if (data.length === 0) {
      console.log('No admin history to backup.');
      return;
    }

    // Generate PDF
    const pdfPath = path.join(__dirname, `../uploads/adminLogsBackup/Admin_Log_Of_${new Date().toLocaleString().split(",")[0].replaceAll('/','_')}.pdf`);
    const doc = new PDFDocument({ margin: 30 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Add title to the PDF
    doc.fontSize(18).text('Admin Panel History Data List', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date And Time : ${new Date().toLocaleString()}`, { align: 'start' });
    doc.moveDown();
    doc.moveDown();

    // Define table properties
    const tableHeaders = ['Sl No', 'Admin ID', 'Action', 'Date'];
    const tableRows = data.map((item, index) => [
      index + 1, // Sl No
      item.adminid || 'N/A', // Admin ID
      item.action || 'N/A', // Action
      item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A', // Date
    ]);

    // Render table
    renderTable(doc, tableHeaders, tableRows, {
      headers: { fontSize: 12, font: 'Helvetica-Bold' },
      rows: { fontSize: 10, font: 'Helvetica' },
      columnWidths: [50, 150, 150, 200],
    });

    // Finalize the PDF
    doc.end();

    // Wait for the PDF to finish writing
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    console.log('PDF generated successfully:', pdfPath);

    // Save the PDF path in the backup table
    await adminHisBackupModel.create({ pdf: pdfPath });
    console.log('PDF path saved in backup table');

    // Clear admin history
    await adminHisModel.deleteMany();
    console.log('Admin history cleared successfully');
  } catch (error) {
    console.error('Error generating or uploading PDF:', error);
  }
};

// Helper function to render a table
function renderTable(doc, headers, rows, options) {
  const { headers: headerStyle, rows: rowStyle, columnWidths } = options;
  let startX = doc.x;
  let startY = doc.y;

  // Render headers
  doc.fontSize(headerStyle.fontSize).font(headerStyle.font);
  headers.forEach((header, index) => {
    doc.text(header, startX, startY, {
      width: columnWidths[index],
      align: 'center',
    });
    startX += columnWidths[index];
  });

  // Draw line below headers
  startY += 20;
  doc.moveTo(doc.page.margins.left, startY).lineTo(doc.page.width - doc.page.margins.right, startY).stroke();
  startY += 10;

  // Render rows
  doc.fontSize(rowStyle.fontSize).font(rowStyle.font);
  rows.forEach((row) => {
    startX = doc.page.margins.left;
    row.forEach((cell, index) => {
      doc.text(cell, startX, startY, {
        width: columnWidths[index],
        align: 'center',
      });
      startX += columnWidths[index];
    });

    startY += 20;

    // Check for page overflow and add a new page if necessary
    if (startY > doc.page.height - doc.page.margins.bottom - 20) {
      doc.addPage();
      startY = doc.y;
    }
  });
}
