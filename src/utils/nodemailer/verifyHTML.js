export const verifyHTML = (link, refreshLink) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
      <style>
          /* Add your custom styles here */
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              /* Match the background color */
              border-radius: 8px;
              box-sizing: border-box;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          .logo {
              text-align: center;
              margin-bottom: 20px;
          }
  
          .logo img {
              max-width: 150px;
          }
  
          .verification-message {
              text-align: center;
              margin-bottom: 20px;
              color: #091e2b;
          }
  
          .verification-buttons {
              text-align: center;
              margin-bottom: 40px;
          }
  
          .verification-buttons a {
              display: inline-block;
              background-color: #c49615;
              color: #fafafa;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin-right: 10px;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
  
          <div class="verification-message">
              <h2 style="color: #c49615;">Account Verification</h2>
              <p>Thank you for registering an account with us. Please verify your email address to activate your account.
              </p>
          </div>
          <div class="verification-buttons">
              <a href="{link}">Verify Email</a>
              <a href="{refreshLink}">Request New Email</a>
          </div>
      </div>
  </body>
  
  </html>
`;
};
