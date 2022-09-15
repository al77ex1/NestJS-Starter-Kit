import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user';

@Entity({
  name: 'token',
})
export class Token {
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

  @ManyToOne(() => User, user => user.tokens)
  user: User;

  toJSON() {
    const { ...self } = this;
    return self;
  }
}

export class TokenFillableFields {
  token: string;
  type: string;
  expires: string;
  blacklisted: boolean;
  user: string;
}
