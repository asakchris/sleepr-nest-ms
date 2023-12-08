import { Inject, Injectable, Logger } from '@nestjs/common';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    private readonly repo: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(dto: CreateReservationDto, { email, _id: userId }: UserDto) {
    return this.paymentsService
      .send('create_charge', {
        ...dto.charge,
        email,
      })
      .pipe(
        map((res) => {
          this.logger.log('res: %o', res);
          return this.repo.create({
            ...dto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          });
        }),
      );
  }

  async findAll() {
    return this.repo.find({});
  }

  async findOne(_id: string) {
    return this.repo.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.repo.findOneAndUpdate({ _id }, { $set: updateReservationDto });
  }

  async remove(_id: string) {
    return this.repo.findOneAndDelete({ _id });
  }
}
