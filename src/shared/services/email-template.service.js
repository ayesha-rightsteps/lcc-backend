const PRIMARY = '#2d6a4f';
const ACCENT = '#c9a84c';
const BG = '#f4f1eb';
const SURFACE = '#ffffff';
const TEXT = '#1a1a1a';
const MUTED = '#6b7280';

const base = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>LCC Academy</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:${PRIMARY};border-radius:12px 12px 0 0;padding:32px 40px;">
              <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.04em;">
                ISSB Smart Study
              </p>
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${ACCENT};">
                LCC Academy
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:${SURFACE};padding:40px;border-left:1px solid #e5e0d5;border-right:1px solid #e5e0d5;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:${PRIMARY};border-radius:0 0 12px 12px;padding:20px 40px;">
              <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.6);">
                LCC Academy &mdash; ISSB Smart Study Portal
              </p>
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">
                This is an automated email, please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const greeting = (name) => `
  <p style="margin:0 0 24px;font-size:16px;color:${TEXT};">
    Dear <strong>${name}</strong>,
  </p>
`;

const divider = `<hr style="border:none;border-top:1px solid #e5e0d5;margin:24px 0;" />`;

const credentialRow = (label, value) => `
  <tr>
    <td style="padding:10px 16px;font-size:13px;color:${MUTED};font-weight:600;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;border-bottom:1px solid #f0ece3;">${label}</td>
    <td style="padding:10px 16px;font-size:14px;color:${TEXT};font-family:monospace;font-weight:700;border-bottom:1px solid #f0ece3;">${value}</td>
  </tr>
`;

const infoRow = (label, value) => `
  <tr>
    <td style="padding:10px 0;font-size:13px;color:${MUTED};font-weight:600;text-transform:uppercase;letter-spacing:0.06em;width:120px;border-bottom:1px solid #f0ece3;">${label}</td>
    <td style="padding:10px 0;font-size:14px;color:${TEXT};font-weight:600;border-bottom:1px solid #f0ece3;">${value}</td>
  </tr>
`;

const welcomeStudentTemplate = (fullName, username, plainPassword) => ({
  subject: 'Welcome to LCC Academy — Your Login Credentials',
  html: base(`
    ${greeting(fullName)}
    <p style="margin:0 0 24px;font-size:15px;color:${TEXT};line-height:1.6;">
      Your enrollment has been successfully processed. You can now access the
      <strong>ISSB Smart Study Portal</strong> using the credentials below.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e0d5;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr style="background-color:#f9f7f3;">
        <td colspan="2" style="padding:12px 16px;font-size:12px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #e5e0d5;">
          Your Login Credentials
        </td>
      </tr>
      ${credentialRow('Username', username)}
      ${credentialRow('Password', plainPassword)}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef9ef;border:1px solid ${ACCENT};border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#7a5c00;line-height:1.5;">
          ⚠️ <strong>Important:</strong> Your account is restricted to <strong>1 device only</strong>.
          Logging in from a second device will alert the admin and may restrict your access.
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;font-size:14px;color:${MUTED};line-height:1.6;">
      Please keep your credentials safe. If you need help, contact our support team.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f3;border:1px solid #e5e0d5;border-radius:8px;margin-bottom:0;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:${MUTED};line-height:1.5;">
          📋 Upon first login, you will be required to read and accept our <strong>Terms &amp; Conditions</strong> before accessing the portal. This covers device restrictions, content protection, and usage policies.
        </td>
      </tr>
    </table>
    ${divider}
    <p style="margin:0;font-size:13px;color:${MUTED};">Best regards,<br/><strong style="color:${PRIMARY};">LCC Academy Team</strong></p>
  `),
});

const passwordResetTemplate = (fullName, username, plainPassword) => ({
  subject: 'LCC Academy — Your Password Has Been Reset',
  html: base(`
    ${greeting(fullName)}
    <p style="margin:0 0 24px;font-size:15px;color:${TEXT};line-height:1.6;">
      Your account password has been reset by the Admin. Use the new credentials below to log in.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e0d5;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr style="background-color:#f9f7f3;">
        <td colspan="2" style="padding:12px 16px;font-size:12px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #e5e0d5;">
          New Credentials
        </td>
      </tr>
      ${credentialRow('Username', username)}
      ${credentialRow('New Password', plainPassword)}
    </table>

    <p style="margin:0 0 24px;font-size:14px;color:${MUTED};line-height:1.6;">
      If you did not request this change, please contact the admin immediately.
    </p>
    ${divider}
    <p style="margin:0;font-size:13px;color:${MUTED};">Best regards,<br/><strong style="color:${PRIMARY};">LCC Academy Team</strong></p>
  `),
});

const consultationAcceptedTemplate = (fullName, meetingDate, meetingTime, meetingLink) => ({
  subject: 'Consultation Confirmed — LCC Academy',
  html: base(`
    ${greeting(fullName)}
    <p style="margin:0 0 24px;font-size:15px;color:${TEXT};line-height:1.6;">
      Great news! Your consultation request has been <strong style="color:${PRIMARY};">accepted</strong>.
      Here are your meeting details:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e0d5;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr style="background-color:#f9f7f3;">
        <td colspan="2" style="padding:12px 16px;font-size:12px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #e5e0d5;">
          Meeting Details
        </td>
      </tr>
      ${infoRow('Date', new Date(meetingDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}
      ${infoRow('Time', meetingTime)}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="${meetingLink}" style="display:inline-block;background-color:${PRIMARY};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.04em;">
            Join Meeting →
          </a>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f3;border:1px solid #e5e0d5;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:${MUTED};line-height:1.5;">
          Please be on time and ensure your camera and microphone are working before joining.
        </td>
      </tr>
    </table>
    ${divider}
    <p style="margin:0;font-size:13px;color:${MUTED};">Best regards,<br/><strong style="color:${PRIMARY};">LCC Academy Team</strong></p>
  `),
});

const consultationRejectedTemplate = (fullName, rejectionReason) => ({
  subject: 'Consultation Update — LCC Academy',
  html: base(`
    ${greeting(fullName)}
    <p style="margin:0 0 24px;font-size:15px;color:${TEXT};line-height:1.6;">
      We regret to inform you that your consultation request could not be accommodated at this time.
    </p>

    ${rejectionReason ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-left:4px solid #c0392b;background-color:#fdf4f4;border-radius:0 8px 8px 0;margin-bottom:24px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#c0392b;text-transform:uppercase;letter-spacing:0.06em;">Reason</p>
          <p style="margin:0;font-size:14px;color:${TEXT};line-height:1.5;">${rejectionReason}</p>
        </td>
      </tr>
    </table>
    ` : ''}

    <p style="margin:0 0 24px;font-size:14px;color:${MUTED};line-height:1.6;">
      You are welcome to submit a new consultation request. We apologise for any inconvenience.
    </p>
    ${divider}
    <p style="margin:0;font-size:13px;color:${MUTED};">Best regards,<br/><strong style="color:${PRIMARY};">LCC Academy Team</strong></p>
  `),
});

export {
  welcomeStudentTemplate,
  passwordResetTemplate,
  consultationAcceptedTemplate,
  consultationRejectedTemplate,
};
