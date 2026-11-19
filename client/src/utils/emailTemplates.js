/**
 * TrueHire Client-Side Email Template HTML Generators
 * Premium Charcoal, Warm White & Gold design system compatible with email clients (Gmail, Outlook, Apple Mail)
 */

export function getClientOtpEmailHtml({
  name = 'Alex Chen',
  otp = '849201',
  expiryMinutes = 10,
  purpose = 'Login Verification'
} = {}) {
  const userName = name || 'Candidate';
  const formattedOtp = String(otp).split('').join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrueHire – Your Login Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF9F6; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(32, 33, 36, 0.08); border: 1px solid #E9E6DF; background-color: #FFFFFF;">
          
          <tr style="background-color: #202124; border-bottom: 2px solid #C6A15B;">
            <td align="center" style="padding: 36px 32px 28px 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #FAF9F6; text-transform: uppercase;">
                TRUEHIRE
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; color: #C6A15B; letter-spacing: 1.5px; text-transform: uppercase;">
                Account Security &bull; Login Verification
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FFFFFF; padding: 40px 36px 32px 36px;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #202124;">
                Hello ${userName},
              </p>
              <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 24px; color: #343538;">
                Welcome back to TrueHire.
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 24px; color: #666666;">
                We received a login request for your account. Your One-Time Password (OTP) is:
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                <tr>
                  <td align="center" style="background-color: #FAF9F6; border: 1px solid #E9E6DF; border-radius: 14px; padding: 24px 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #C6A15B;">
                      Login Verification Code
                    </p>
                    <div style="font-family: monospace; font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #202124; text-indent: 12px; margin: 4px 0;">
                      ${formattedOtp}
                    </div>
                    <p style="margin: 6px 0 0 0; font-size: 12px; color: #666666;">
                      Valid for this sign-in attempt only
                    </p>
                  </td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF9F6; border-left: 4px solid #C6A15B; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #202124;">
                      <strong>Expiry:</strong> This code expires in <strong>${expiryMinutes} minutes</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #666666; border-top: 1px solid #E9E6DF; padding-top: 16px;">
                Regards,<br>
                <strong style="color: #202124;">TrueHire Security Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #202124; padding: 20px; text-align: center; border-top: 1px solid #343538;">
              <p style="margin: 0; font-size: 10px; color: #666666;">&copy; ${new Date().getFullYear()} TrueHire Inc. Automated security notification.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getClientLoginSuccessEmailHtml({
  userName = 'Alex Chen',
  email = 'alex.dev@stanford.edu',
  role = 'candidate',
  date = '',
  time = ''
} = {}) {
  const loginDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const loginTime = time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Successful Login Alert – TrueHire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF9F6; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(32, 33, 36, 0.08); border: 1px solid #E9E6DF; background-color: #FFFFFF;">
          
          <tr style="background-color: #202124; border-bottom: 2px solid #C6A15B;">
            <td align="center" style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #FAF9F6;">
                Successful Login Alert
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; color: #C6A15B; letter-spacing: 1px; text-transform: uppercase;">
                Authorized Session Started
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FFFFFF; padding: 36px 36px 32px 36px;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #202124;">
                Hello ${userName},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #666666;">
                Your TrueHire account was successfully accessed.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF9F6; border: 1px solid #E9E6DF; border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #666666; width: 35%;"><strong>Email:</strong></td>
                  <td style="padding: 6px 0; color: #202124; font-family: monospace;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Account Type:</strong></td>
                  <td style="padding: 6px 0; color: #202124; text-transform: capitalize; font-weight: 600;">${role}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Login Date:</strong></td>
                  <td style="padding: 6px 0; color: #202124;">${loginDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Login Time:</strong></td>
                  <td style="padding: 6px 0; color: #202124;">${loginTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Login Status:</strong></td>
                  <td style="padding: 6px 0; color: #C6A15B; font-weight: 700;">Successful</td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #666666; border-top: 1px solid #E9E6DF; padding-top: 16px;">
                Thank you,<br>
                <strong style="color: #202124;">TrueHire Security Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #202124; padding: 20px; text-align: center; border-top: 1px solid #343538;">
              <p style="margin: 0; font-size: 10px; color: #666666;">&copy; ${new Date().getFullYear()} TrueHire Inc.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getClientApplicationEmailHtml({
  candidateName = 'Alex Chen',
  jobTitle = 'Senior Full Stack Engineer',
  companyName = 'Acme Inc.',
  location = 'Remote',
  jobType = 'Full-Time',
  applicationId = 'APP-849201',
  appliedDate = ''
} = {}) {
  const formattedDate = appliedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Submitted Successfully – TrueHire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF9F6; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(32, 33, 36, 0.08); border: 1px solid #E9E6DF; background-color: #FFFFFF;">
          
          <tr style="background-color: #202124; border-bottom: 2px solid #C6A15B;">
            <td align="center" style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FAF9F6;">
                Application Submitted
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 600; color: #C6A15B; font-family: monospace;">
                ID: #${applicationId}
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FFFFFF; padding: 36px 36px 32px 36px;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #202124;">
                Hello ${candidateName},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #666666;">
                Your application has been successfully submitted through TrueHire.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF9F6; border: 1px solid #E9E6DF; border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #666666; width: 35%;"><strong>Job Title:</strong></td>
                  <td style="padding: 6px 0; color: #202124; font-weight: 700;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Company:</strong></td>
                  <td style="padding: 6px 0; color: #202124; font-weight: 600;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Job Type:</strong></td>
                  <td style="padding: 6px 0; color: #202124;">${jobType}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Location:</strong></td>
                  <td style="padding: 6px 0; color: #202124;">${location}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Application ID:</strong></td>
                  <td style="padding: 6px 0; color: #202124; font-family: monospace;">${applicationId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Applied Date:</strong></td>
                  <td style="padding: 6px 0; color: #202124;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666666;"><strong>Status:</strong></td>
                  <td style="padding: 6px 0; color: #C6A15B; font-weight: 700;">Applied</td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #343538;">
                You can track your application status anytime through your <strong>TrueHire Candidate Dashboard</strong>.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #C6A15B;">
                    <a href="http://localhost:5173/candidate/dashboard" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #202124; text-decoration: none; border-radius: 12px;">
                      Track on Candidate Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #666666; border-top: 1px solid #E9E6DF; padding-top: 16px;">
                Thank you for choosing TrueHire.<br>
                <strong style="color: #202124;">TrueHire Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #202124; padding: 20px; text-align: center; border-top: 1px solid #343538;">
              <p style="margin: 0; font-size: 10px; color: #666666;">&copy; ${new Date().getFullYear()} TrueHire Inc.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const generateOtpEmailHtml = getClientOtpEmailHtml;
export const generateLoginSuccessEmailHtml = getClientLoginSuccessEmailHtml;
export const generateApplicationSubmittedEmailHtml = getClientApplicationEmailHtml;
