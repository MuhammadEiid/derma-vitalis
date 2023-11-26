export const completeAppointmentEmail = (patientName, doctorName) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <title>Appointment Completed</title>
      <style>
          body, html {
              margin: 0;
              padding: 0;
          }
  
          /* Set background color for the whole email */
          body {
              background-color: #fafafa;
              /* Updated background color */
              font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #091e2b;
              /* Text color updated to match the darker color */
          }
  
          /* Container for the email content */
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #fafafa;
              /* Match the background color */
              padding: 20px;
              border-radius: 8px;
              box-sizing: border-box; /* Added to include padding in width calculation */
          }
  
          /* Header styles */
          .header {
              text-align: center;
          }
  
          /* Logo styles */
          .logo {
              font-size: 24px;
              font-weight: bold;
              color: #c49615;
              margin-bottom: 10px;
              /* Add some decorative styling */
              border-bottom: 2px solid #c49615;
              padding-bottom: 5px;
          }
  
          /* Body content styles */
          .content {
              padding: 5px 0 20px 0;
          }
  
          /* Footer styles */
          .footer {
              text-align: center;

              color: #c49615;
              /* Accent color remains the same */
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <div class="header">
              <!-- Replace the image logo with text -->
              <div class="logo" style="text-align: center; font-size: 24px; font-weight: bold; color: #c49615; margin-bottom: 10px;">
                  <span>Derma Vitalis</span>
              </div>
              <h2 style="color: #c49615;">Appointment Completed</h2>
          </div>
          <div class="content">
              <p style="color: #091e2b;">Dear ${patientName},</p>
              <p style="color: #091e2b;">We are pleased to inform you that your appointment with Doctor ${doctorName} has been successfully completed.</p>
              <p style="color: #091e2b;">If you have any follow-up questions or need further assistance, please feel free to Contact us.</p>
          </div>
          <div class="footer">
              <p>This is an automated message. Please do not reply.</p>
          </div>
      </div>
  </body>
  
  </html>
  `;
};
