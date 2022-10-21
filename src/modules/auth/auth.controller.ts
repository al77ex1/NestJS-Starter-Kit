import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, AuthTokenService } from './services/';
import { LoginPayload, LogoutPayload, RegisterPayload, RefreshTokenPayload } from './dto/';
import { CurrentUser } from './../common/decorator/current-user.decorator';
import { User, UsersService } from './../user';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() payload: RegisterPayload): Promise<any> {
    const user = await this.userService.create(payload);
    return await this.authTokenService.generateAuthTokens(user);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user = await this.authService.validateUser(payload);
    return await this.authTokenService.generateAuthTokens(user);
  }

  @Post('logout')
  @ApiResponse({ status: 201, description: 'Successful Logout' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Body() payload: LogoutPayload): Promise<any> {
    return await this.authService.logout(payload);
  }

  @Post('refresh-tokens')
  @ApiResponse({ status: 201, description: 'Successful Refresh Token' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshTokens(@Body() payload: RefreshTokenPayload): Promise<any> {
    return await this.authTokenService.refreshAuth(payload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
