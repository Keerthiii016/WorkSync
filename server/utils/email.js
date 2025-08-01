const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // If email credentials are not configured, log instead of sending
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not sent (credentials not configured):', {
        to,
        subject,
        html: html ? 'HTML content present' : 'No HTML',
        text: text ? 'Text content present' : 'No text'
      });
      return { success: true, message: 'Email logged (not sent - no credentials)' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  welcome: (name, verificationUrl) => ({
    subject: 'Welcome to WorkSync!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to WorkSync, ${name}!</h2>
        <p>Thank you for joining WorkSync. We're excited to help you manage your projects and tasks more efficiently.</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The WorkSync Team
        </p>
      </div>
    `
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Reset Your WorkSync Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Password Reset Request</h2>
        <p>We received a request to reset your WorkSync password.</p>
        <p>Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The WorkSync Team
        </p>
      </div>
    `
  }),

  projectInvite: (inviterName, projectName, inviteUrl) => ({
    subject: `You've been invited to join "${projectName}" on WorkSync`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Project Invitation</h2>
        <p>${inviterName} has invited you to join the project <strong>"${projectName}"</strong> on WorkSync.</p>
        <p>Click the button below to accept the invitation:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        <p>You'll be able to collaborate on tasks, share updates, and track progress together.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The WorkSync Team
        </p>
      </div>
    `
  }),

  taskAssignment: (assignerName, taskTitle, projectName, taskUrl) => ({
    subject: `You've been assigned a task: "${taskTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Task Assignment</h2>
        <p>${assignerName} has assigned you a new task in the project <strong>"${projectName}"</strong>.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #374151;">Task: ${taskTitle}</h3>
          <p style="margin: 0; color: #6b7280;">Project: ${projectName}</p>
        </div>
        <p>Click the button below to view the task details:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${taskUrl}" 
             style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Task
          </a>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The WorkSync Team
        </p>
      </div>
    `
  }),

  taskDueReminder: (taskTitle, projectName, dueDate, taskUrl) => ({
    subject: `Reminder: Task "${taskTitle}" is due soon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">Task Due Reminder</h2>
        <p>This is a friendly reminder that you have a task due soon.</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">Task: ${taskTitle}</h3>
          <p style="margin: 5px 0; color: #92400e;"><strong>Project:</strong> ${projectName}</p>
          <p style="margin: 5px 0; color: #92400e;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Click the button below to view and update the task:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${taskUrl}" 
             style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Task
          </a>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The WorkSync Team
        </p>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
}; 