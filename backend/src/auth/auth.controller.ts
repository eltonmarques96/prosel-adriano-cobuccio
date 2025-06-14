/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { Public } from '@/metadata';
import { AuthUserDTO } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>): Promise<AuthUserDTO> {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  async getProfile(@Request() req): Promise<AuthUserDTO> {
    try {
      const user = await this.authService.profile(req.data.sub);
      const response = new AuthUserDTO(200, req.token, user);
      return response;
    } catch (error: any) {
      const response = new AuthUserDTO(
        HttpStatus.UNAUTHORIZED,
        null,
        null,
        typeof error.message === 'string' ? error.message : 'Unauthorized',
      );
      return response;
    }
  }
}
