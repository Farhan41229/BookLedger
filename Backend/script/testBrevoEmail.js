import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

const sendTestEmail = async () => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error('BREVO_API_KEY is not set in config/config.env');
    process.exit(1);
  }

  const emailData = {
    sender: {
      name: 'Farhan Tahsin Khan',
      email: 'farhankhan@iut-dhaka.edu',
    },
    to: [{ email: 'farhankhan@iut-dhaka.edu' }],
    subject: 'BookLedger - Brevo Test Email',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">BookLedger - Test Email</h2>
        <p>This is a test email sent from the BookLedger backend using Brevo.</p>
        <p>If you received this, the Brevo integration is working correctly.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
      </div>
    `,
  };

  try {
    console.log('Sending test email to farhankhan@iut-dhaka.edu...');
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      },
    );
    console.log('Test email sent successfully!', response.data);
  } catch (error) {
    console.error(
      'Failed to send test email:',
      error.response?.data || error.message,
    );
  }
};

sendTestEmail();
