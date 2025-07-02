const ResetPasswordEmail = ({ email, resetLink }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .email-header {
      background-color: #0057b8; /* Deep blue header */
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .email-body {
      padding: 20px;
      text-align: center;
    }
    .email-body h1 {
      font-size: 24px;
      color: #0057b8; /* Echoing the deep blue theme */
    }
    .email-body p {
      font-size: 16px;
      line-height: 1.5;
      margin-top: 20px;
      margin-bottom: 20px;
      color: #666;
    }
    .email-body a {
      display: inline-block;
      background-color: #0057b8; /* Green button for positive action */
      color: #ffffff;
      padding: 10px 25px;
      font-size: 18px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: bold;
    }
    .email-footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 12px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Password Reset for Car Rentals</h1>
    </div>
    <div class="email-body">
      <h1>Hello ${email},</h1>
      <p>We received a request to reset your password for your Afnai Car Rentals account. If you did not request this, please ignore this email.</p>
      <p>To reset your password, please click the button below:</p>
      <a href="${resetLink}" target="_blank">Reset Password</a>
      <p>This link will expire in 60 minutes.</p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} Afnai Car Rentals. All rights reserved.</p>
      <p>Need help? Contact our support team at support@afnaicarrentals.com</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = ResetPasswordEmail;
