// // utils/emailTemplates.js
// // Returns HTML strings for various emails

// const registerEmail = (name, code) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #0284c7;">Welcome to CSMS!</h2>
//       <p>Hello ${name},</p>
//       <p>Thank you for registering. Please verify your email address using the following code:</p>
//       <div style="background-color: #f0f9ff; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #0284c7;">
//         ${code}
//       </div>
//       <p>This code will expire in 15 minutes.</p>
//       <p>If you didn't request this, please ignore this email.</p>
//       <p>Regards,<br/>CSMS Team</p>
//     </div>
//   `;
// };

// const resetPasswordEmail = (name, code) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #0284c7;">Password Reset Request</h2>
//       <p>Hello ${name},</p>
//       <p>You requested to reset your password. Use the following code to proceed:</p>
//       <div style="background-color: #f0f9ff; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #0284c7;">
//         ${code}
//       </div>
//       <p>This code will expire in 15 minutes.</p>
//       <p>If you didn't request this, please ignore this email.</p>
//       <p>Regards,<br/>CSMS Team</p>
//     </div>
//   `;
// };

// const welcomeEmail = (name, orgName) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #0284c7;">Welcome to CSMS, ${name}!</h2>
//       <p>Your organization <strong>${orgName}</strong> has been successfully set up.</p>
//       <p>You can now log in and start managing your attendance system.</p>
//       <p>Regards,<br/>CSMS Team</p>
//     </div>
//   `;
// };

// module.exports = { registerEmail, resetPasswordEmail, welcomeEmail };

// utils/emailTemplates.js
// HTML templates for various emails

const registerEmail = (name, code) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0284c7;">Welcome to CSMS!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering. Please verify your email address using the following code:</p>
      <div style="background-color: #f0f9ff; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #0284c7;">
        ${code}
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Regards,<br/>CSMS Team</p>
    </div>
  `;
};

const resetPasswordEmail = (name, code) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0284c7;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Use the following code to proceed:</p>
      <div style="background-color: #f0f9ff; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #0284c7;">
        ${code}
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Regards,<br/>CSMS Team</p>
    </div>
  `;
};

const welcomeEmail = (name, orgName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0284c7;">Welcome to CSMS, ${name}!</h2>
      <p>Your organization <strong>${orgName}</strong> has been successfully set up.</p>
      <p>You can now log in and start managing your attendance system.</p>
      <p>Regards,<br/>CSMS Team</p>
    </div>
  `;
};

module.exports = { registerEmail, resetPasswordEmail, welcomeEmail };