import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Event, User } from 'generated/prisma';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  readonly resend = new Resend(process.env.RESEND_API_KEY);
  async sendEventCreatingEmail({
    user,
    event,
  }: {
    user: Omit<User, 'password'>;
    event: Event;
  }) {
    try {
      return this.resend.emails.send({
        from: process.env.FROM_EMAIL ?? 'eventify@eventify.chihab.tech.com',
        to: [user.email],
        subject: 'Event Created',
        html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Event Created</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }

              h1 {
                color: #333;
              }
              p {
                font-size: 16px;
                line-height: 1.5;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
              }
              .button:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Event Created Successfully</h1>
              <p>Hi ${user.firstName},</p>
              <p>Your event "${event.title}" has been created successfully.</p>
              <p>Event Details:</p>
              <ul>
                <li><strong>Title:</strong> ${event.title}</li>
                <li><strong>Date:</strong> ${event.startsAt.toISOString()} to ${event.endsAt.toISOString()}</li>
                <li><strong>Location:</strong> ${event.location}</li>
              </ul>
              <p>Thank you for using our service!</p>
            </div>
          </body>
        </html>
        `,
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("can't send the email");
    }
  }
  async sendVerificationEmail(email: string, userId: string, token: string) {
    return this.resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'default@eventify.chihab.tech',
      to: [email],
      subject: 'Verify your email',
      html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f4f4f7;
          color: #333;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #2c3e50;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #6366f1;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #888;
          text-align: center;
        }
        .button-text{
        color:white
    }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <a href="${process.env.CLIENT_URL}/accounts/verify/${userId}/${token}" class="button"> <span class='button-text'>Verify Email</span></a>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Chihab Tech. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`,
    });
  }
}
