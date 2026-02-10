// import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from '../mailtrap/emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
  const apiKey = process.env.BREVO_API_KEY;
  const url = 'https://api.brevo.com/v3/smtp/email';

  const emailData = {
    sender: {
      name: 'BookLedger',
      email: 'farhankhan@iut-dhaka.edu',
    },
    to: [
      {
        email: email, // Fix: Directly pass the email here, not an object
      },
    ],
    subject: 'Verify Email',
    htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace(
      '{verificationCode}',
      verificationToken
    ),
  };

  try {
    const response = await axios.post(url, emailData, {
      headers: {
        'Content-Type': 'application/json',
        'api-Key': apiKey,
      },
    });
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

// Send Welcome Email via Brevo (Sendinblue)
export const sendWelcomeEmail = async (email, name) => {
  const apiKey = process.env.BREVO_API_KEY;
  const url = 'https://api.brevo.com/v3/smtp/email';

  const emailData = {
    sender: {
      name: 'BookLedger',
      email: 'farhankhan@iut-dhaka.edu',
    },
    to: [
      {
        email: email,
      },
    ],
    subject: 'Welcome to BookLedger!',
    htmlContent: WELCOME_EMAIL_TEMPLATE.replace('{name}', name),
  };

  try {
    const response = await axios.post(url, emailData, {
      headers: {
        'Content-Type': 'application/json',
        'api-Key': apiKey,
      },
    });
    console.log('Welcome email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

// Call the function with example email and verification token
// sendVerificationEmail('ayon55928@gmail.com', 'Farhan Tahsin Khan');

// Send Password Reset Email via Brevo
export const sendPasswordResetEmail = async (email, resetURL) => {
  const apiKey = process.env.BREVO_API_KEY;
  const url = 'https://api.brevo.com/v3/smtp/email';

  const emailData = {
    sender: {
      name: 'BookLedger',
      email: 'farhankhan@iut-dhaka.edu',
    },
    to: [
      {
        email: email,
      },
    ],
    subject: 'Reset Your Password',
    htmlContent: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      '{resetURL}',
      resetURL
    ),
  };

  try {
    const response = await axios.post(url, emailData, {
      headers: {
        'Content-Type': 'application/json',
        'api-Key': apiKey,
      },
    });
    console.log('Password reset email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

// Send Password Reset Success Email via Brevo
export const sendPasswordResetSuccessEmail = async (email) => {
  const apiKey = process.env.BREVO_API_KEY;
  const url = 'https://api.brevo.com/v3/smtp/email';

  const emailData = {
    sender: {
      name: 'BookLedger',
      email: 'farhankhan@iut-dhaka.edu',
    },
    to: [
      {
        email: email,
      },
    ],
    subject: 'Password Reset Successful',
    htmlContent: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    const response = await axios.post(url, emailData, {
      headers: {
        'Content-Type': 'application/json',
        'api-Key': apiKey,
      },
    });
    console.log('Password reset success email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
