import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Unique } from './../common';
import { SameAs } from './../common/validator/same-as.validator';
import { User } from './../user';

export type UserRoleType = 'admin' | 'user';

export class RegisterPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @Unique([User])
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  role: UserRoleType;

  @ApiProperty({ required: true })
  @SameAs('password')
  passwordConfirmation: string;
}
