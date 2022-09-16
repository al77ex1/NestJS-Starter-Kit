import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user';

@Entity({
  name: 'auth',
})
export class Auth {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 255 })
  token: string;

  @Column({ length: 50 })
  type: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  expires: string;

  @Column({ type: 'boolean', default: false })
  blacklisted: boolean;

  @ManyToOne(() => User, user => user.auths, { onDelete: 'CASCADE' })
  user: User;

  toJSON() {
    const { ...self } = this;
    return self;
  }
}

export class AuthFillableFields {
  token: string;
  type: string;
  expires: string;
  blacklisted: boolean;
  user: string;
}
