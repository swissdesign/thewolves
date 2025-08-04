// this automation is designed by P.Heiniger Design specifically for thewolves.ch as an automated reply to applications

// The sheet name that will receive the data
const SHEET_NAME = "TheWolves_Applications";

// This function runs when a POST request is made to the script's URL
function doPost(e) {
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);

    // If the sheet doesn't exist, stop and return an error.
    if (!sheet) {
      throw new Error("Sheet '" + SHEET_NAME + "' not found.");
    }
    
    const data = JSON.parse(e.postData.contents);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newRow = headers.map(header => {
      if (header === "Timestamp") {
        return new Date();
      }
      return data[header] || "";
    });

    // Append the new row to the sheet
    sheet.appendRow(newRow);
    
    // --- SEND THE AUTOMATED EMAIL ---
    
    const applicantName = data.name || "Instructor";
    const applicantEmail = data.email;
    const subject = "Your Application to The Wolves";
    
    // The full HTML content of the email
    const htmlBody = `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="x-apple-disable-message-reformatting">
        <title>The Wolves</title>
        <!--[if mso]><style> * { font-family: sans-serif !important; } </style><![endif]-->
        <style>
            html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; background: #ffffff; color: #000000; }
            * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
            table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
        </style>
    </head>
    <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #ffffff;">
        <center style="width: 100%; background-color: #ffffff;">
            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;"><tr><td align="center" valign="top" width="600"><![endif]-->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td style="padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-family: 'Times New Roman', Times, serif; font-size: 32px; line-height: 1.2; font-weight: 500; color: #000000;">The Wolves.</h1>
                        <p style="margin: 5px 0 0 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; font-weight: normal; color: #999999; letter-spacing: 1px; text-transform: uppercase;">
                            Wisdom Of Learning Via Experience & Skill
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 30px 40px 30px; background-color: #ffffff;">
                        <p style="margin: 0 0 25px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #cccccc;">Hello [Applicant Name],</p>
                        <p style="margin: 0 0 30px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #cccccc;">Thank you for your application. Your interest is valued.</p>
                        <div style="border-left: 2px solid #444444; padding-left: 20px; margin-bottom: 30px;">
                            <p style="margin: 0; font-family: Georgia, serif; font-size: 16px; line-height: 1.7; color: #bbbbbb;">
                                The Wolves is for instructors who have reached the pinnacle of their national system. It is for those who begin to look beyond its structure, seeking to integrate knowledge from other methodologies. This is not a replacement for your certification, but an evolution beyond it.<br><br>
                                Our modules are designed for this stage, covering advanced cross-system mechanics, high-net-worth client psychology, and complex team dynamics. We are a community-driven standard, partnering with global resorts to address practical needs like visa optimization and fair compensation for elite instructors.<br><br>
                                Your achievements are issued as a Soulbound Token (SBT) on Web3. This is your permanent, verifiable credential—knowledge bound to you for life.
                            </p>
                        </div>
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #cccccc;">Your application is under review. We contact qualified candidates directly.</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px 20px; text-align: center; border-top: 1px solid #222222;">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #666666;">&copy; 2025 The Wolves &nbsp;&nbsp;&nbsp; thewolves.ch</p>
                    </td>
                </tr>
            </table>
            <!--[if mso | IE]></td></tr></table><![endif]-->
        </center>
    </body>
    </html>
    `;
    
    // Personalize the email by replacing the placeholder
    const personalizedHtmlBody = htmlBody.replace('[Applicant Name]', applicantName);

    // Check if there is an email to send to
    if (applicantEmail) {
        MailApp.sendEmail({
            to: applicantEmail,
            subject: subject,
            htmlBody: personalizedHtmlBody,
            name: 'The Wolves',
            replyTo: 'join@thewolves.ch',
            from: 'join@thewolves.ch' // This line makes the email come from your alias
        });
    }

    // Return a success response to the website's form
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return an error response if something goes wrong
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
