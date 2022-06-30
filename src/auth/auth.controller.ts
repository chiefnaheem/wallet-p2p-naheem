import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(201)
  @Post('register')
  register(@Res() res: Response, @Body() dto: AuthDto) {
    // console.log({ dto: dto });
    const result = this.authService.register(dto);
    res.send(result);
    // return `Successfully registered`
  }
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
