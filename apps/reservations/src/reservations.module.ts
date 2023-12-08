import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import {
  AUTH_SERVICE,
  DatabaseModule,
  LoggerModule,
  PAYMENTS_SERVICE,
} from '@app/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/reservations/.env',
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('AUTH_HOST'),
            port: config.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('PAYMENTS_HOST'),
            port: config.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
