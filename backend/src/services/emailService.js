// Email Service
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendLoanNotification(to, subject, message) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `Eco-Lender: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #10B981;">Eco-Lender Notification</h2>
            <p>${message}</p>
            <hr style="border: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      });

      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPaymentReminder(to, lenderName, amount, dueDate) {
    return this.sendLoanNotification(
      to,
      'Payment Reminder',
      `Dear ${lenderName}, you have a payment of $${amount} due on ${dueDate}. Please login to your account to make the payment.`
    );
  }

  async sendProjectUpdate(to, projectTitle, update) {
    return this.sendLoanNotification(
      to,
      'Project Update',
      `New update on project "${projectTitle}": ${update}`
    );
  }

  async sendVerificationEmail(to, code) {
    return this.sendLoanNotification(
      to,
      'Email Verification',
      `Your verification code is: <strong>${code}</strong>. This code expires in 24 hours.`
    );
  }
}

module.exports = new EmailService();
