const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const adminHisModel = require('../models/adminPanelHistory');
const cloudinary = require('../config/cloudinary');
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
    const pdfPath = path.join(__dirname, `../uploads/temppdf.pdf`);
    const doc = new PDFDocument({ margin: 30 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Add title to the PDF
    doc.fontSize(18).text('Admin Panel History Data List', { align: 'center' });
    doc.moveDown();

    // Draw table headers
    const headers = ['Sl No', 'Admin ID', 'Action', 'Date'];
    const columnWidths = [50, 150, 150, 200];
    let startX = doc.x;
    let startY = doc.y;

    doc.fontSize(12).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, startX, startY, { width: columnWidths[i], align: 'center' });
      startX += columnWidths[i];
    });

    // Draw a line below headers
    startY += 20;
    doc.moveTo(doc.x, startY).lineTo(doc.page.width - doc.page.margins.right, startY).stroke();
    startY += 10;

    // Add rows to the table
    doc.font('Helvetica');
    data.forEach((obj, index) => {
      startX = doc.x;
      const row = [
        index + 1, // Sl No
        obj.adminid,
        obj.action,
        new Date(obj.createdAt).toLocaleString(),
      ];

      row.forEach((cell, i) => {
        doc.text(cell, startX, startY, { width: columnWidths[i], align: 'center' });
        startX += columnWidths[i];
      });

      startY += 20;
      // Add a new page if we run out of space
      if (startY > doc.page.height - doc.page.margins.bottom - 20) {
        doc.addPage();
        startY = doc.y;
      }
    });

    // Finalize the PDF
    doc.end();

    // Wait for the PDF to finish writing
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Upload the PDF to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: 'auto',
      folder: 'admin_panal_Logs_pdfs',
    });

    // Delete the temporary PDF file
    fs.unlinkSync(pdfPath);

    // Save the Cloudinary URL in backup table
    await adminHisBackupModel.create({ pdf: uploadResult.secure_url });
    console.log('PDF URL saved in backup table');

    // Clear admin history
    await adminHisModel.deleteMany();
    console.log('Admin history cleared successfully');
  } catch (error) {
    console.error('Error generating or uploading PDF:', error);
  }
};
