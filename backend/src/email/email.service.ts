import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  readonly resend = new Resend(process.env.RESEND_API_KEY);
  async sendVerificationEmail(email: string, userId: string, token: string) {
    return this.resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'default@chihab.tech',
      to: [email],
      subject: 'Verify your email',
      html: `
          <html>
            <body>  
                <h1>Verify your email</h1>
                <p>Click the link below to verify your email:</p>
                <a href="${process.env.CLIENT_URL}/accounts/verify/${userId}/${token}">Verify Email</a>
            </body>
            </html>
        `,
    });
  }
}
