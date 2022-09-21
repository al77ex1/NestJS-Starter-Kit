import { ApiProperty } from '@nestjs/swagger';

export class LogoutPayload {
  @ApiProperty({
    required: true,
  })
  refreshToken: string;
}
