import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserFillableFields } from './user.entity';
import { Roles } from '../config'

@Injectable()
export class UsersService {
  private roles = new Roles();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async get(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email }});
  }

  async create(payload: UserFillableFields) {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    const allRoles = this.roles.getRoles();
    if (!allRoles.find(role => role === payload.role)) throw new NotAcceptableException('Unknown role.',);
    return await this.userRepository.save(payload);
  }
}
