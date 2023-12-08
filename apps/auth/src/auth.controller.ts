import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser, UserDocument } from '@app/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Payload() data: any) {
    console.log(data);
    return data.user;
  }
}
