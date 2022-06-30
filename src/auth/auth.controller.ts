import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(201)
  @Post('register')
  register(@Body() dto: AuthDto) {
    // console.log({ dto: dto });
    return this.authService.register(dto);
    // return `Successfully registered`
  }
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
