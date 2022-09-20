import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../utils/Hash';
import * as moment from 'moment';
import { ConfigService, tokenTypes } from './../config';
import { User, UsersService } from './../user';
import { LoginPayload } from './login.payload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth, AuthFillableFields } from './auth.entity';

@Injectable()
export class AuthService {
  private readonly tokenTypes: { [key: string]: string };

  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    this.tokenTypes = tokenTypes;
  }

  generateToken(userId: string, expires: number, type: string) {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires,
      type,
    };
    return this.jwtService.sign(payload);
  }

  async saveToken(payload: AuthFillableFields) {
    return await this.authRepository.save(payload as object);
  }

  async generateAuthTokens(user: User) {
    const accessTokenExpires = moment()
      .add(this.configService.get('JWT_ACCESS_EXPIRATION_MINUTES'), 'minutes')
      .unix();
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      this.tokenTypes.ACCESS,
    );

    const refreshTokenExpires = moment()
      .add(this.configService.get('JWT_REFRESH_EXPIRATION_DAYS'), 'days')
      .unix();
    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      this.tokenTypes.REFRESH,
    );
    await this.saveToken({
      token: refreshToken,
      expires: moment.unix(refreshTokenExpires).format('YYYY-MM-DD HH:mm:ss'),
      type: tokenTypes.REFRESH,
      blacklisted: false,
      user: user.id,
    });

    return {
      access: {
        token: accessToken,
        expires: moment.unix(accessTokenExpires).format('YYYY-MM-DD HH:mm:ss'),
      },
      refresh: {
        token: refreshToken,
        expires: moment.unix(refreshTokenExpires).format('YYYY-MM-DD HH:mm:ss'),
      },
      user,
    };
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }
}
