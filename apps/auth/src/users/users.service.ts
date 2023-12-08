import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async create(dto: CreateUserDto) {
    await this.validateCreateUserDto(dto);

    return this.repo.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
  }

  private async validateCreateUserDto(dto: CreateUserDto) {
    try {
      await this.repo.findOne({ email: dto.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('email already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.repo.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async getUser(dto: GetUserDto) {
    return this.repo.findOne(dto);
  }
}
