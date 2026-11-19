/**
 * TrueHire Email Templates with 100% Inline CSS for Gmail, Outlook & Apple Mail Compatibility
 */

/**
 * 1. Login Verification Code (OTP) Email Template
 */
function getLoginOtpEmailHtml({ userName = 'User', otp = '000000', expiryMinutes = 5 }) {
  const formattedOtp = String(otp).trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrueHire – Your Login Verification Code</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #080B16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #080B16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080B16; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45); border: 1px solid rgba(148, 163, 184, 0.2);">
          
          <!-- DARK NAVY HEADER -->
          <tr>
            <td align="center" style="background-color: #0D1324; background-image: linear-gradient(180deg, #0D1324 0%, #111A2E 100%); padding: 36px 32px 28px 32px; border-bottom: 2px solid #3B82F6;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td align="center" style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%); padding: 2px;">
                          <div style="background-color: #080B16; border-radius: 10px; width: 44px; height: 44px; text-align: center; line-height: 44px;">
                            <span style="font-size: 22px; font-weight: 800; color: #22D3EE;">⚡</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #F8FAFC; text-transform: uppercase;">
                      TRUE<span style="color: #3B82F6;">HIRE</span>
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; color: #94A3B8; letter-spacing: 1.5px; text-transform: uppercase;">
                      Account Security &bull; Login Verification
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WHITE/LIGHT CONTENT BODY -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px 36px 32px 36px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <tr>
                  <td style="padding-bottom: 18px;">
                    <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                      Hello ${userName},
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 24px; color: #334155;">
                      Welcome back to TrueHire!
                    </p>
                    <p style="margin: 0; font-size: 15px; line-height: 24px; color: #475569;">
                      We received a login request for your account. Your One-Time Password (OTP) is:
                    </p>
                  </td>
                </tr>

                <!-- BRIGHT BLUE AND PURPLE GRADIENT OTP BOX -->
                <tr>
                  <td align="center" style="padding: 16px 0 24px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0D1324 0%, #17233A 100%); border: 2px solid #3B82F6; border-radius: 14px; padding: 26px 20px; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);">
                          <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #22D3EE;">
                            Login Verification Code
                          </p>
                          <div style="font-family: 'SF Mono', Consolas, Monaco, 'Courier New', monospace; font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #FFFFFF; text-indent: 12px; margin: 6px 0; background: linear-gradient(135deg, #22D3EE 0%, #6366F1 50%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: #FFFFFF;">
                            ${formattedOtp}
                          </div>
                          <p style="margin: 8px 0 0 0; font-size: 12px; color: #94A3B8;">
                            Valid for this sign-in attempt only
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- EXPIRY WARNING -->
                <tr>
                  <td style="padding-bottom: 22px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border-left: 4px solid #3B82F6; border-radius: 8px; padding: 14px 16px;">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 13px; line-height: 20px; color: #334155;">
                            <strong>⏱️ Expiry:</strong> This code expires in <strong>${expiryMinutes} minutes</strong>.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- SECURITY WARNING -->
                <tr>
                  <td style="padding-bottom: 22px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFF1F2; border-left: 4px solid #F43F5E; border-radius: 8px; padding: 14px 16px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #9F1239;">
                            🛡️ Security Notice
                          </p>
                          <p style="margin: 0; font-size: 12px; line-height: 18px; color: #BE123C;">
                            If you did not initiate this login, please ignore this email and secure your account immediately. Never share your OTP with anyone.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- SIGN OFF -->
                <tr>
                  <td style="border-top: 1px solid #E2E8F0; padding-top: 18px;">
                    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #475569;">
                      Regards,<br>
                      <strong style="color: #0F172A;">TrueHire Security Team</strong>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- PROFESSIONAL FOOTER -->
          <tr>
            <td style="background-color: #080B16; padding: 24px 32px; border-top: 1px solid rgba(148, 163, 184, 0.16); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: #F8FAFC;">
                TrueHire Global Trust Platform
              </p>
              <p style="margin: 0; font-size: 10px; line-height: 16px; color: #94A3B8;">
                &copy; ${new Date().getFullYear()} TrueHire Inc. All rights reserved. Automated security notification.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 2. Successful Login Alert Email Template
 */
function getLoginSuccessEmailHtml({ userName = 'User', email = '', role = 'candidate', date = '', time = '' }) {
  const loginDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const loginTime = time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Successful Login Alert – TrueHire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080B16; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45); border: 1px solid rgba(148, 163, 184, 0.2);">
          
          <!-- DARK NAVY HEADER -->
          <tr>
            <td align="center" style="background-color: #0D1324; background-image: linear-gradient(180deg, #0D1324 0%, #111A2E 100%); padding: 36px 32px 28px 32px; border-bottom: 2px solid #22C55E;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td align="center" style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); box-shadow: 0 0 20px rgba(34, 197, 94, 0.4); text-align: center; line-height: 48px;">
                          <span style="font-size: 24px; color: #FFFFFF; font-weight: bold; line-height: 48px;">&#10003;</span>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #F8FAFC;">
                      Successful Login Alert
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; color: #22C55E; letter-spacing: 1px; text-transform: uppercase;">
                      Authorized Session Started
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT BODY -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 36px 36px 32px 36px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                      Hello ${userName},
                    </p>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #475569;">
                      Your TrueHire account was successfully accessed.
                    </p>
                  </td>
                </tr>

                <!-- STRUCTURED LOGIN DETAILS CARD -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 14px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #3B82F6;">
                            Login Details
                          </p>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                            <tr>
                              <td style="padding: 6px 0; color: #64748B; width: 35%;"><strong>Email:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A; font-family: monospace;">${email}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Account Type:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A; text-transform: capitalize; font-weight: 600;">${role}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Login Date:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A;">${loginDate}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Login Time:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A;">${loginTime}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Login Status:</strong></td>
                              <td style="padding: 6px 0; color: #16A34A; font-weight: 700;">Successful</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- SECURITY WARNING -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFF1F2; border-left: 4px solid #F43F5E; border-radius: 8px; padding: 14px 16px;">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 12px; line-height: 18px; color: #BE123C;">
                            <strong>If this login was not performed by you</strong>, please secure your account immediately by resetting your password or contacting <a href="mailto:support@truehire.io" style="color: #BE123C; font-weight: 700;">support@truehire.io</a>.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- SIGN OFF -->
                <tr>
                  <td style="border-top: 1px solid #E2E8F0; padding-top: 18px;">
                    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #475569;">
                      Thank you,<br>
                      <strong style="color: #0F172A;">TrueHire Security Team</strong>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #080B16; padding: 24px 32px; border-top: 1px solid rgba(148, 163, 184, 0.16); text-align: center;">
              <p style="margin: 0; font-size: 10px; color: #94A3B8;">
                &copy; ${new Date().getFullYear()} TrueHire Inc. This is an automated security alert.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 3. Job Application Confirmation Email Template
 */
function getApplicationConfirmationEmailHtml({
  candidateName = 'Candidate',
  jobTitle = 'Software Engineer',
  companyName = 'Company',
  jobType = 'Full-Time',
  location = 'Remote',
  applicationId = 'APP-100000',
  appliedDate = ''
}) {
  const formattedDate = appliedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Submitted Successfully – TrueHire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080B16; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45); border: 1px solid rgba(148, 163, 184, 0.2);">
          
          <!-- DARK NAVY HEADER -->
          <tr>
            <td align="center" style="background-color: #0D1324; background-image: linear-gradient(180deg, #0D1324 0%, #111A2E 100%); padding: 36px 32px 28px 32px; border-bottom: 2px solid #22C55E;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
                      <tr>
                        <td align="center" style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); box-shadow: 0 0 20px rgba(34, 197, 94, 0.4); text-align: center; line-height: 52px;">
                          <span style="font-size: 26px; color: #FFFFFF; font-weight: bold; line-height: 52px;">&#10003;</span>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #F8FAFC;">
                      Application Submitted!
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 600; color: #22D3EE; font-family: monospace;">
                      ID: #${applicationId}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WHITE CONTENT BODY -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 36px 36px 32px 36px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                      Hello ${candidateName},
                    </p>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #475569;">
                      Congratulations! Your application has been successfully submitted through TrueHire.
                    </p>
                  </td>
                </tr>

                <!-- STRUCTURED DETAILS CARD -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 14px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #3B82F6;">
                            APPLICATION DETAILS
                          </p>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                            <tr>
                              <td style="padding: 6px 0; color: #64748B; width: 35%;"><strong>Job Title:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A; font-weight: 700;">${jobTitle}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Company:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${companyName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Job Type:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A;">${jobType}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Location:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A;">${location}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Application ID:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A; font-family: monospace;">${applicationId}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Applied Date:</strong></td>
                              <td style="padding: 6px 0; color: #0F172A;">${formattedDate}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #64748B;"><strong>Status:</strong></td>
                              <td style="padding: 6px 0; color: #16A34A; font-weight: 700;">Applied</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- TRACKING NOTE -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 22px; color: #334155;">
                      Your application is now successfully recorded.
                    </p>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #334155;">
                      You can track your application status through your <strong>TrueHire Candidate Dashboard</strong>.
                    </p>
                  </td>
                </tr>

                <!-- BUTTON LINK -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%); box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);">
                          <a href="http://localhost:5173/candidate/dashboard" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px;">
                            Track on Candidate Dashboard &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- SIGN OFF -->
                <tr>
                  <td style="border-top: 1px solid #E2E8F0; padding-top: 18px;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569;">
                      Thank you for choosing TrueHire!
                    </p>
                    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #475569;">
                      Regards,<br>
                      <strong style="color: #0F172A;">TrueHire Team</strong>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #080B16; padding: 24px 32px; border-top: 1px solid rgba(148, 163, 184, 0.16); text-align: center;">
              <p style="margin: 0; font-size: 10px; color: #94A3B8;">
                &copy; ${new Date().getFullYear()} TrueHire Inc. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 4. Recruiter Application Notification Email Template
 */
function getRecruiterApplicationNotificationHtml({
  candidateName = 'A Candidate',
  jobTitle = 'Software Engineer',
  applicationId = 'APP-100000',
  applicationDate = '',
  status = 'Applied'
}) {
  const formattedDate = applicationDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Candidate Application Received – TrueHire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080B16; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45); border: 1px solid rgba(148, 163, 184, 0.2);">
          
          <tr style="background-color: #0D1324; border-bottom: 2px solid #8B5CF6;">
            <td align="center" style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #F8FAFC;">
                New Candidate Application
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; color: #A78BFA; letter-spacing: 1px; text-transform: uppercase;">
                Recruiter Portal Notification
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FFFFFF; padding: 36px 36px 32px 36px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; color: #0F172A; font-weight: 600;">
                A new candidate has applied for your job listing:
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 22px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748B; width: 35%;"><strong>Candidate:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A; font-weight: 700;">${candidateName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Job Title:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Applied Date:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Status:</strong></td>
                  <td style="padding: 6px 0; color: #16A34A; font-weight: 700;">${status}</td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);">
                    <a href="http://localhost:5173/recruiter/dashboard" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px;">
                      View in Recruiter Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 14px;">
                Regards,<br>
                <strong style="color: #0F172A;">TrueHire Recruiter Support</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #080B16; padding: 20px; text-align: center; border-top: 1px solid rgba(148, 163, 184, 0.16);">
              <p style="margin: 0; font-size: 10px; color: #94A3B8;">&copy; ${new Date().getFullYear()} TrueHire Inc.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 5. Payment Successful Email Template
 */
function getPaymentSuccessEmailHtml({
  recruiterName = 'Recruiter',
  companyName = 'Company',
  planName = 'Professional',
  amount = 1499,
  currency = 'INR',
  transactionId = 'pay_test_123',
  paymentDate = '',
  validUntil = '',
  invoiceUrl = 'http://localhost:5173/recruiter/billing'
}) {
  const formattedDate = paymentDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedExpiry = validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Successful – TrueHire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080B16; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45); border: 1px solid rgba(148, 163, 184, 0.2);">
          
          <tr style="background-color: #0D1324; border-bottom: 2px solid #22C55E;">
            <td align="center" style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #F8FAFC;">
                Payment Successful!
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 600; color: #22C55E;">
                Subscription Entitlement Activated
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FFFFFF; padding: 36px 36px 32px 36px;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                Hello ${recruiterName},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
                Thank you for your payment. Your <strong>${planName}</strong> plan for <strong>${companyName}</strong> is now officially active.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748B; width: 38%;"><strong>Plan:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A; font-weight: 700;">${planName} Plan</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Amount Paid:</strong></td>
                  <td style="padding: 6px 0; color: #16A34A; font-weight: 800; font-size: 15px;">₹${Number(amount).toLocaleString('en-IN')} ${currency}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Transaction ID:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A; font-family: monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Payment Date:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Valid Until:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${formattedExpiry}</td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);">
                    <a href="${invoiceUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px;">
                      Manage Billing &amp; Invoices &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #475569; border-top: 1px solid #E2E8F0; padding-top: 16px;">
                Happy Hiring,<br>
                <strong style="color: #0F172A;">TrueHire Billing Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #080B16; padding: 20px; text-align: center; border-top: 1px solid rgba(148, 163, 184, 0.16);">
              <p style="margin: 0; font-size: 10px; color: #94A3B8;">&copy; ${new Date().getFullYear()} TrueHire Inc. Official payment receipt.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 6. Payment Failed Email Template
 */
function getPaymentFailureEmailHtml({
  recruiterName = 'Recruiter',
  planName = 'Professional',
  amount = 1499,
  currency = 'INR',
  failureReason = 'Payment authorization could not be completed',
  retryUrl = 'http://localhost:5173/recruiter/pricing'
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Failed – TrueHire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080B16; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45); border: 1px solid rgba(148, 163, 184, 0.2);">
          
          <tr style="background-color: #0D1324; border-bottom: 2px solid #F43F5E;">
            <td align="center" style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #F8FAFC;">
                Payment Failed
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 600; color: #F43F5E;">
                Transaction Incomplete
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FFFFFF; padding: 36px 36px 32px 36px;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                Hello ${recruiterName},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
                We were unable to process your payment for the <strong>${planName}</strong> plan. No funds have been deducted from your account.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFF1F2; border: 1px solid #FECDD3; border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #9F1239; width: 38%;"><strong>Plan:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A; font-weight: 700;">${planName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9F1239;"><strong>Attempted Amount:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A;">₹${amount} ${currency}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9F1239;"><strong>Reason:</strong></td>
                  <td style="padding: 6px 0; color: #BE123C; font-weight: 600;">${failureReason}</td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);">
                    <a href="${retryUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px;">
                      Retry Payment &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #475569; border-top: 1px solid #E2E8F0; padding-top: 16px;">
                Need help? Contact <a href="mailto:support@truehire.io" style="color: #3B82F6;">support@truehire.io</a>.<br>
                <strong style="color: #0F172A;">TrueHire Billing Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #080B16; padding: 20px; text-align: center; border-top: 1px solid rgba(148, 163, 184, 0.16);">
              <p style="margin: 0; font-size: 10px; color: #94A3B8;">&copy; ${new Date().getFullYear()} TrueHire Inc.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 7. Refund Confirmation Email Template
 */
function getRefundConfirmationEmailHtml({
  recruiterName = 'Recruiter',
  companyName = 'Company',
  amount = 1499,
  currency = 'INR',
  refundId = 'rfnd_test_123',
  originalTransactionId = 'pay_test_123'
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Refund Processed – TrueHire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080B16; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45); border: 1px solid rgba(148, 163, 184, 0.2);">
          
          <tr style="background-color: #0D1324; border-bottom: 2px solid #3B82F6;">
            <td align="center" style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #F8FAFC;">
                Refund Processed
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 600; color: #22D3EE;">
                Credit Transmitted
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FFFFFF; padding: 36px 36px 32px 36px;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                Hello ${recruiterName},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
                A refund has been confirmed and initiated for <strong>${companyName}</strong> via Razorpay. It typically reflects in your source account within 5-7 business days.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748B; width: 38%;"><strong>Refund Amount:</strong></td>
                  <td style="padding: 6px 0; color: #16A34A; font-weight: 800;">₹${amount} ${currency}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Refund ID:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A; font-family: monospace;">${refundId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;"><strong>Payment Reference:</strong></td>
                  <td style="padding: 6px 0; color: #0F172A; font-family: monospace;">${originalTransactionId}</td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #475569; border-top: 1px solid #E2E8F0; padding-top: 16px;">
                Thank you,<br>
                <strong style="color: #0F172A;">TrueHire Billing Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #080B16; padding: 20px; text-align: center; border-top: 1px solid rgba(148, 163, 184, 0.16);">
              <p style="margin: 0; font-size: 10px; color: #94A3B8;">&copy; ${new Date().getFullYear()} TrueHire Inc.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  getLoginOtpEmailHtml,
  getLoginSuccessEmailHtml,
  getApplicationConfirmationEmailHtml,
  getRecruiterApplicationNotificationHtml,
  getPaymentSuccessEmailHtml,
  getPaymentFailureEmailHtml,
  getRefundConfirmationEmailHtml,
  // Alias for backward compatibility if referenced
  getOtpEmailHtml: getLoginOtpEmailHtml
};
