import {
  Injectable,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import { Hash } from '../../../utils/Hash';
import { tokenTypes } from './../../config';
import { UsersService } from './../../user';
import { LoginPayload, LogoutPayload } from '../dto/';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth } from './../auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UsersService,
  ) {}

  async logout(payload: LogoutPayload) {
    const refreshTokenDoc = await this.authRepository.findOne({ where: {
      token: payload.refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    }});
    if (!refreshTokenDoc) throw new NotAcceptableException('Token not found');

    await this.authRepository.delete({ token: payload.refreshToken });
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }
}
