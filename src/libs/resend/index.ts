import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error('RESEND_API_KEY is not defined in environment variables.');
}

export const resend = new Resend(resendApiKey);
