const nodemailer = require('nodemailer');
const {
  getLoginOtpEmailHtml,
  getLoginSuccessEmailHtml,
  getApplicationConfirmationEmailHtml,
  getRecruiterApplicationNotificationHtml,
  getPaymentSuccessEmailHtml,
  getPaymentFailureEmailHtml,
  getRefundConfirmationEmailHtml
} = require('../utils/emailTemplates');

class EmailService {
  constructor() {
    this.transporter = null;
    this.sentEmails = []; // In-memory audit log of sent emails
    this.initTransporter();
  }

  /**
   * Configure reusable Nodemailer transporter using process.env
   */
  initTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass && user !== 'yourgmail@gmail.com' && pass !== 'your_google_app_password') {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection on initialization
      this.transporter.verify((error) => {
        if (error) {
          console.warn('[EmailService] ⚠️ SMTP connection check warning:', error.message);
        } else {
          console.log('[EmailService] ✅ SMTP Transporter ready for Gmail delivery via:', user);
        }
      });
    } else {
      console.log('[EmailService] ℹ️ SMTP configured with placeholder credentials. Configure server/.env with real Gmail App Password for live SMTP transmission.');
    }
  }

  /**
   * Helper to execute mail dispatch
   */
  async _sendMail({ to, subject, html, emailType, meta = {} }) {
    const from = process.env.EMAIL_FROM || `TrueHire <${process.env.SMTP_USER || 'no-reply@truehire.io'}>`;
    
    const mailOptions = {
      from,
      to,
      subject,
      html
    };

    const record = {
      id: 'EMAIL-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      to,
      from,
      subject,
      type: emailType,
      sentAt: new Date(),
      status: 'pending',
      ...meta
    };

    // Attempt real SMTP delivery if transporter is configured
    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        record.status = 'sent';
        record.messageId = info.messageId;
        console.log(`[EmailService] 📧 REAL EMAIL SENT via Gmail SMTP to: ${to} | Subject: "${subject}" | MessageId: ${info.messageId}`);
      } catch (smtpError) {
        record.status = 'failed';
        record.error = smtpError.message;
        console.error(`[EmailService] ❌ Gmail SMTP delivery failed to ${to}:`, smtpError.message);
        // Do not crash the application on email delivery failure
      }
    } else {
      record.status = 'logged';
      console.log(`[EmailService] 📧 Simulated Email dispatched to: ${to} | Subject: "${subject}"`);
    }

    this.sentEmails.unshift(record);
    if (this.sentEmails.length > 100) this.sentEmails.pop();

    return record;
  }

  /**
   * 1. Send Login OTP to registered candidate or recruiter email
   * @param {string} email
   * @param {string} otp
   * @param {string} userName
   */
  async sendLoginOTP(email, otp, userName = 'User') {
    if (!email) throw new Error('Recipient email is required for login OTP');

    const subject = 'TrueHire – Your Login Verification Code';
    const html = getLoginOtpEmailHtml({
      userName: userName || email.split('@')[0],
      otp,
      expiryMinutes: 5
    });

    return await this._sendMail({
      to: email,
      subject,
      html,
      emailType: 'login_otp',
      meta: { otpMasked: otp.replace(/./g, '*') }
    });
  }

  /**
   * 2. Send Successful Login Alert Notification
   * @param {object} user - { email, role, name, date, time }
   */
  async sendLoginSuccessNotification(user) {
    if (!user || !user.email) return null;

    const subject = 'Successful Login Alert – TrueHire';
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

    const html = getLoginSuccessEmailHtml({
      userName: user.name || user.email.split('@')[0],
      email: user.email,
      role: user.role || 'candidate',
      date,
      time
    });

    return await this._sendMail({
      to: user.email,
      subject,
      html,
      emailType: 'login_success_alert',
      meta: { role: user.role }
    });
  }

  /**
   * Send Password Reset Code Email
   */
  async sendPasswordResetEmail(toEmail, resetCode, userName = 'User') {
    const html = `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #242A35;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 16px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background: #FFFFFF; border-radius: 12px; border: 1px solid #E7E8E6; padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <tr>
            <td>
              <h2 style="margin: 0 0 16px 0; color: #242A35; font-size: 22px;">Reset Your TrueHire Password</h2>
              <p style="color: #626B78; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
                Hello ${userName || 'there'},<br/><br/>
                We received a request to reset the password for your TrueHire account. Use the 6-digit code below to set a new password:
              </p>
              <div style="background-color: #F7F5F0; border: 1px solid #E7E8E6; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
                <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #344B68;">${resetCode}</span>
              </div>
              <p style="color: #626B78; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;">
                This code will expire in 10 minutes. If you did not request a password reset, you can safely ignore this email.
              </p>
              <div style="border-top: 1px solid #E7E8E6; padding-top: 16px; font-size: 12px; color: #626B78;">
                TrueHire Platform Security
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return await this._sendMail({
      to: toEmail,
      subject: `TrueHire Password Reset Code: ${resetCode}`,
      html,
      emailType: 'password_reset',
      meta: { resetCode }
    });
  }

  /**
   * 3. Send Job Application Confirmation to Candidate
   * @param {string} email
   * @param {object} applicationDetails
   */
  async sendApplicationConfirmation(email, applicationDetails = {}) {
    if (!email) throw new Error('Candidate email is required for confirmation');

    const subject = 'Application Submitted Successfully – TrueHire';
    const html = getApplicationConfirmationEmailHtml({
      candidateName: applicationDetails.candidateName || email.split('@')[0],
      jobTitle: applicationDetails.jobTitle || 'Role',
      companyName: applicationDetails.companyName || 'Verified Employer',
      jobType: applicationDetails.jobType || 'Full-Time',
      location: applicationDetails.location || 'Remote',
      applicationId: applicationDetails.applicationId || 'APP-' + Date.now(),
      appliedDate: applicationDetails.appliedDate
    });

    return await this._sendMail({
      to: email,
      subject,
      html,
      emailType: 'application_confirmation',
      meta: { applicationId: applicationDetails.applicationId }
    });
  }

  /**
   * 4. Send Application Notification to Recruiter
   * @param {string} email
   * @param {object} applicationDetails
   */
  async sendRecruiterApplicationNotification(email, applicationDetails = {}) {
    if (!email) return null;

    const subject = 'New Candidate Application Received – TrueHire';
    const html = getRecruiterApplicationNotificationHtml({
      candidateName: applicationDetails.candidateName || 'Candidate',
      jobTitle: applicationDetails.jobTitle || 'Role',
      applicationId: applicationDetails.applicationId || 'APP-' + Date.now(),
      applicationDate: applicationDetails.appliedDate,
      status: applicationDetails.status || 'Applied'
    });

    return await this._sendMail({
      to: email,
      subject,
      html,
      emailType: 'recruiter_application_alert',
      meta: { applicationId: applicationDetails.applicationId }
    });
  }

  /**
   * 5. Send Payment Success Confirmation Email
   */
  async sendPaymentSuccessEmail(email, details = {}) {
    if (!email) return null;

    const subject = 'Payment Successful – TrueHire';
    const html = getPaymentSuccessEmailHtml(details);

    return await this._sendMail({
      to: email,
      subject,
      html,
      emailType: 'payment_success',
      meta: { transactionId: details.transactionId, amount: details.amount }
    });
  }

  /**
   * 6. Send Payment Failure Alert Email
   */
  async sendPaymentFailureEmail(email, details = {}) {
    if (!email) return null;

    const subject = 'Payment Failed – TrueHire';
    const html = getPaymentFailureEmailHtml(details);

    return await this._sendMail({
      to: email,
      subject,
      html,
      emailType: 'payment_failure',
      meta: { amount: details.amount, reason: details.failureReason }
    });
  }

  /**
   * 7. Send Refund Confirmation Email
   */
  async sendRefundConfirmationEmail(email, details = {}) {
    if (!email) return null;

    const subject = 'Refund Processed – TrueHire';
    const html = getRefundConfirmationEmailHtml(details);

    return await this._sendMail({
      to: email,
      subject,
      html,
      emailType: 'payment_refund',
      meta: { refundId: details.refundId, amount: details.amount }
    });
  }

  /**
   * Helpers for auditing and testing
   */
  getLastSentEmail(email = null, type = null) {
    return (
      this.sentEmails.find(
        (e) => (!email || e.to.toLowerCase() === email.toLowerCase()) && (!type || e.type === type)
      ) || this.sentEmails[0] || null
    );
  }

  getAllSentEmails() {
    return this.sentEmails;
  }
}

module.exports = new EmailService();
