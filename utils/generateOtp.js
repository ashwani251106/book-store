function generateOtp() {
    return Math.floor(100000 + Math.random()*9000000).toString();
} 
function getOtphtml(otp) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your OTP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <tr>
                <td style="padding: 32px 40px 20px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                    <h2 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Your App Name</h2>
                </td>
            </tr>
            
            <tr>
                <td style="padding: 40px 40px 20px 40px;">
                    <h1 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 22px; font-weight: 600; line-height: 30px;">Verification Code</h1>
                    <p style="margin: 0 0 24px 0; color: #555555; font-size: 16px; line-height: 24px;">
                        Hello,
                    </p>
                    <p style="margin: 0 0 32px 0; color: #555555; font-size: 16px; line-height: 24px;">
                        Thank you for choosing us. Use the following One-Time Password (OTP) to complete your verification process. This code is strictly confidential and is only valid for **10 minutes**.
                    </p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 32px auto;">
                        <tr>
                            <td style="background-color: #f0f4f8; padding: 16px 36px; border-radius: 6px; letter-spacing: 6px; text-align: center; border: 1px dashed #cbd5e1;">
                                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; color: #0284c7; margin-right: -6px;">${otp}</span>
                            </td>
                        </tr>
                    </table>

                    <p style="margin: 0 0 24px 0; color: #ff3333; font-size: 14px; line-height: 20px; font-weight: 500;">
                        ⚠️ If you did not request this code, please ignore this email or secure your account immediately.
                    </p>
                </td>
            </tr>
            
            <tr>
                <td style="padding: 20px 40px 40px 40px; text-align: center; background-color: #fafafa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px; line-height: 18px;">
                        This is an automated transactional message. Please do not reply directly to this email.
                    </p>
                    <p style="margin: 0; color: #888888; font-size: 12px; line-height: 18px;">
                        &copy; ${new Date().getFullYear()} Your Company Inc. All rights reserved.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}
module.exports = {generateOtp , getOtphtml}