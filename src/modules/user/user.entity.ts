import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordTransformer } from './password.transformer';

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

  @Column()
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
