// PDF Generation Service
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  static generateLoanAgreement(loan, lender, borrower, project) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const filename = `loan-agreement-${loan.loanId}.pdf`;
        const filepath = path.join(__dirname, '../../uploads', filename);

        // Create stream
        const stream = fs.createWriteStream(filepath);

        doc.on('finish', () => {
          resolve({
            success: true,
            filename,
            path: filepath
          });
        });

        doc.pipe(stream);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('LOAN AGREEMENT', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(1);

        // Parties
        doc.fontSize(12).font('Helvetica-Bold').text('PARTIES');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Lender: ${lender.fullName} (${lender.email})`);
        doc.text(`Borrower: ${borrower.fullName} (${borrower.email})`);
        doc.text(`Project: ${project.title}`);
        doc.moveDown(1);

        // Loan Terms
        doc.fontSize(12).font('Helvetica-Bold').text('LOAN TERMS');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Principal Amount: $${loan.principalAmount.toFixed(2)}`);
        doc.text(`Interest Rate: ${loan.interestRate}% per annum`);
        doc.text(`Duration: ${loan.duration} months`);
        doc.text(`Total Amount: $${loan.totalAmount.toFixed(2)}`);
        doc.text(`Start Date: ${new Date(loan.startDate).toLocaleDateString()}`);
        doc.text(`Maturity Date: ${new Date(loan.maturityDate).toLocaleDateString()}`);
        doc.moveDown(1);

        // Terms and Conditions
        doc.fontSize(12).font('Helvetica-Bold').text('TERMS AND CONDITIONS');
        doc.fontSize(9).font('Helvetica');
        doc.text('1. The borrower agrees to repay the principal amount with interest as per the agreed schedule.');
        doc.text('2. Payments must be made on or before the due date.');
        doc.text('3. Late payments may incur penalties as per the agreement.');
        doc.text('4. This agreement is binding on both parties and their successors.');
        doc.moveDown(1);

        // Signatures
        doc.fontSize(12).font('Helvetica-Bold').text('SIGNATURES');
        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica');
        doc.text('Lender: ________________________');
        doc.moveDown(1);
        doc.text('Borrower: ________________________');
        doc.moveDown(1);
        doc.text('Date: ________________________');

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static generateImpactCertificate(loan, lender, project) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const filename = `impact-certificate-${loan.loanId}.pdf`;
        const filepath = path.join(__dirname, '../../uploads', filename);

        const stream = fs.createWriteStream(filepath);

        doc.on('finish', () => {
          resolve({
            success: true,
            filename,
            path: filepath
          });
        });

        doc.pipe(stream);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('IMPACT CERTIFICATE', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text('Eco-Lender', { align: 'center' });
        doc.moveDown(1);

        // Certificate Details
        doc.fontSize(14).font('Helvetica-Bold').text('This certifies that', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(16).font('Helvetica-Bold').text(lender.fullName, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica').text('has made a sustainable investment in', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(14).font('Helvetica-Bold').text(project.title, { align: 'center' });
        doc.moveDown(1);

        // Investment Details
        doc.fontSize(11).font('Helvetica');
        doc.text(`Investment Amount: $${loan.principalAmount.toFixed(2)}`);
        doc.text(`Project Category: ${project.category}`);
        doc.text(`Investment Date: ${new Date(loan.startDate).toLocaleDateString()}`);
        doc.moveDown(1);

        // Impact
        doc.fontSize(12).font('Helvetica-Bold').text('Estimated Environmental Impact:');
        doc.fontSize(10).font('Helvetica');
        doc.text(`• Beneficiaries: ${project.impact?.expectedBeneficiaries || 0}+ people`);
        doc.text(`• CO₂ Reduction: ${project.impact?.carbonReductionEstimate || 0} tons`);
        doc.moveDown(1);

        // Footer
        doc.fontSize(9).font('Helvetica').text(
          'This certificate is issued in recognition of your commitment to sustainable development.',
          { align: 'center' }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFService;
