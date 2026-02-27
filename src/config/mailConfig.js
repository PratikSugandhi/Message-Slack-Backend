import nodemailer from 'nodemailer';

import { MAIL_ID, MAIL_PASSWORD } from './serverConfig';

// CREATING THE transporter for nodemailer
export default nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_ID,
    pass: MAIL_PASSWORD
  }
});