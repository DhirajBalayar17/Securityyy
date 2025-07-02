const WelcomeEmail = ({ name }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Car Rental!</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f4f4f9;
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
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #007bff; /* Bright blue header */
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .email-header img {
      max-width: 120px;
    }
    .email-body {
      padding: 20px;
      text-align: center;
    }
    .email-body h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #007bff;
    }
    .email-body p {
      font-size: 16px;
      line-height: 1.6;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #666;
    }
    .cta-button {
      display: block;
      width: 200px;
      text-align: center;
      background-color: #28a745; /* Green button for positive action */
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 5px;
      margin: 20px auto;
    }
    .email-footer {
      background-color: #f4f4f9;
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
      <img src="https://example.com/path/to/logo.png" alt="MyCar Rental Logo">
      <h1>Welcome to MyCar Rental!</h1>
    </div>
    <div class="email-body">
      <h1>Dear ${name},</h1>
      <p>We're excited to have you on board. Discover the best vehicles for your needs and rent them with ease at MyCar Rental.</p>
      <p>Explore our wide range of cars, from economy to luxury, all available at competitive prices and with flexible rental terms.</p>
      <a href="https://mycarrental.com/login" class="cta-button">Get Started</a>
      <p>If you need any assistance or have questions, our team is always ready to help you!</p>
      <p>Thank you for choosing MyCar Rental. Drive safe, and enjoy your journey!</p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} MyCar Rental. All rights reserved.</p>
      <p>Contact us: support@mycarrental.com</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = WelcomeEmail;
