import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payements-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  private readonly stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2023-10-16',
  });

  constructor(
    private readonly config: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // });
    this.logger.log('card: %o, amount: %d, email: %s', card, amount, email);

    const paymentIntent = await this.stripe.paymentIntents.create({
      //payment_method: paymentMethod.id,
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      //payment_method_types: ['card'],
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    this.logger.log('Payment completed');

    this.notificationService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully.`,
    });

    return paymentIntent;
  }
}
