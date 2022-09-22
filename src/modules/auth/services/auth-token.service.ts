import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { ConfigService, tokenTypes } from './../../config';
import { User, UsersService } from './../../user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth, AuthFillableFields } from './../auth.entity';

@Injectable()
export class AuthTokenService {
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
      id: userId,
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

  async refreshAuth(refreshToken: string) {
    try {
      const refreshTokenDoc = await this.verifyToken(
        refreshToken,
        tokenTypes.REFRESH,
      );
      const user = await this.userService.get(refreshTokenDoc.id);
      if (!user) throw new Error('User not found');

      await this.authRepository.delete({ token: refreshTokenDoc.token });
      return await this.generateAuthTokens(user);
    } catch (error) {
      throw new NotAcceptableException(`Please authenticate. ${error}`);
    }
  }

  async verifyToken(token: string, type: string) {
    const payload = this.jwtService.verify(token);
    const tokenDoc = await this.authRepository.findOne({
      token,
      type,
      blacklisted: false,
      user: payload.id,
    });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  }
}
