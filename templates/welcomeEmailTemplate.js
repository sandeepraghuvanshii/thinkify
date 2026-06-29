// templates/welcomeEmailTemplate.js
export const welcomeEmailTemplate = ({ username, accessToken }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome Email</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">

              <tr>
                <td align="center" style="background:#4F46E5; padding:30px;">
                  <h1 style="color:#ffffff; margin:0;">Welcome to Bookify 📚</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:40px;">
                  <h2 style="color:#333;">Hello ${username} 👋</h2>

                  <p style="color:#555; line-height:1.8;">
                    Thank you for joining <strong>Bookify</strong>. We're excited to have you onboard.
                  </p>

                  <p style="color:#555; line-height:1.8;">
                    Click the button below to verify your account and get started.
                  </p>

                  <div style="text-align:center; margin:30px 0;">
                    <a
                      href="http://localhost:3000/api/auth/verify?token=${accessToken}"
                      style="background:#4F46E5; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; display:inline-block; font-weight:bold;"
                    >
                      Verify Account
                    </a>
                  </div>

                  <p style="color:#888; font-size:14px;">
                    If you didn’t create an account, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="background:#f8f8f8; padding:20px; color:#777; font-size:14px;">
                  © 2026 Bookify. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
