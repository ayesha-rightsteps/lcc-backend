const welcomeStudentTemplate = (fullName, username, plainPassword) => ({
  subject: 'LCC Academy - Your Login Credentials',
  html: `
    <h2>Welcome to LCC Academy!</h2>
    <p>Dear ${fullName},</p>
    <p>Your enrollment has been successfully processed.</p>
    <br/>
    <p><strong>Your Login Credentials:</strong></p>
    <p>Username: <b>${username}</b></p>
    <p>Password: <b>${plainPassword}</b></p>
    <br/>
    <p>Please log in to the portal using these credentials.</p>
    <p>Note: Your account is restricted to a maximum of 2 devices.</p>
    <br/>
    <p>Best Regards,<br/>LCC Academy Team</p>
  `,
});

const passwordResetTemplate = (fullName, username, plainPassword) => ({
  subject: 'LCC Academy - Your Password Has Been Reset',
  html: `
    <h2>LCC Academy - Security Update</h2>
    <p>Dear ${fullName},</p>
    <p>Your password has been reset by the Admin.</p>
    <br/>
    <p><strong>Your New Credentials:</strong></p>
    <p>Username: <b>${username}</b></p>
    <p>New Password: <b>${plainPassword}</b></p>
    <br/>
    <p>Best Regards,<br/>LCC Academy Team</p>
  `,
});

const consultationAcceptedTemplate = (fullName, meetingDate, meetingTime, meetingLink) => ({
  subject: 'Consultation Scheduled - LCC Academy',
  html: `
    <h2>LCC Academy - Consultation Scheduled</h2>
    <p>Dear ${fullName},</p>
    <p>Sir has accepted your consultation request.</p>
    <br/>
    <p><strong>Meeting Details:</strong></p>
    <p>Date: <b>${new Date(meetingDate).toDateString()}</b></p>
    <p>Time: <b>${meetingTime}</b></p>
    <p>Link: <a href="${meetingLink}">${meetingLink}</a></p>
    <br/>
    <p>Please be on time.</p>
  `,
});

const consultationRejectedTemplate = (fullName, rejectionReason) => ({
  subject: 'Consultation Update - LCC Academy',
  html: `
    <h2>LCC Academy - Consultation Update</h2>
    <p>Dear ${fullName},</p>
    <p>Unfortunately, Sir is unable to accept your consultation request at this time.</p>
    ${rejectionReason ? `<p>Reason: ${rejectionReason}</p>` : ''}
  `,
});

export {
  welcomeStudentTemplate,
  passwordResetTemplate,
  consultationAcceptedTemplate,
  consultationRejectedTemplate,
};
