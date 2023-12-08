import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { PaymentsCreateChargeDto } from './dto/payements-create-charge.dto';

@Controller()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    this.logger.log('data: %o', data);
    return this.paymentsService.createCharge(data);
  }
}
