import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, UserDocument } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
