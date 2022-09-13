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
    type: 'date',
    nullable: false,
  })
  expires: string;

  @Column({ type: 'boolean', default: false })
  blacklisted: boolean;

  @ManyToOne(() => User, user => user.tokens)
  user: User;
}

export class TokenFillableFields {
  token: string;
  type: string;
  expires: string;
  blacklisted: string;
}
