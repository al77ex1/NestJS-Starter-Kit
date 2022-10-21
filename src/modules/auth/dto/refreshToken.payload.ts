import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenPayload {
  @ApiProperty({
    required: true,
  })
  refreshToken: string;
}
