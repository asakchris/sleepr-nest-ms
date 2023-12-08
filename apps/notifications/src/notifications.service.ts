import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.config.get('SMTP_USER'),
      clientId: this.config.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.config.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.config.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  constructor(private readonly config: ConfigService) {}

  async notifyEmail({ email, text }: NotifyEmailDto) {
    this.logger.log('email: %s', email);
    await this.transporter.sendMail({
      from: this.config.get('SMTP_USER'),
      to: email,
      subject: 'Sleepr Notification',
      text,
    });
  }
}
