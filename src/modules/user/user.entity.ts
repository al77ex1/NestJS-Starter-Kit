import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PasswordTransformer } from './password.transformer';
import { Token } from '../auth';

export type UserRoleType = 'admin' | 'user';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  email: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: UserRoleType;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({
    type: 'date',
    nullable: true,
    default: () => 'NOW()',
  })
  createdAt: string;

  @Column({
    type: 'date',
    nullable: true,
    default: () => 'NOW()',
  })
  updatedAt: string;

  @OneToMany(() => Token, token => token.user)
  tokens: Token[];

  toJSON() {
    const { password, ...self } = this;
    return self;
  }
}

export class UserFillableFields {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
}
