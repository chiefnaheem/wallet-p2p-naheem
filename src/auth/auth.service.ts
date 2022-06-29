import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: AuthDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('User not found');
    //compare the password
    const isValid = await argon.verify(user.password, dto.password);
    if (!isValid) throw new ForbiddenException('Invalid credentials');
    return this.accessToken(user.id, user.email);
  }
  async register(dto: AuthDto) {
    //generate password hash
    const passwordHash = await argon.hash(dto.password);

    //save the user in the database
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: passwordHash,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'User already exists with the credentials',
          );
        }
        throw Error;
      }
    }
  }
  async accessToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      {
        sub: userId,
        email,
      },
      { expiresIn: '1hr', secret },
    );
    return { access_token: token };
  }
}
