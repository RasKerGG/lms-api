import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtil } from '../common/utils/password.util';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) return null;

    const isValid = await PasswordUtil.comparePassword(password, user.password);
    if (!isValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findUserByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = await this.usersService.createUser(registerDto);
    return this.generateTokens(user);
  }

  login(user) {
    return this.generateTokens(user);
  }

  async generateTokens(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    const refreshTokenHash = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshToken(user.id, refreshTokenHash);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);

    const user = await this.usersService.findUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const storedHash = await this.usersService.getRefreshToken(user.id);

    if (!storedHash) {
      throw new UnauthorizedException('Токен не найден');
    }

    const isValid = await bcrypt.compare(refreshToken, storedHash);

    if (!isValid) {
      throw new UnauthorizedException('Неверный рефреш токен');
    }

    return this.generateTokens(user);
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);

    return { message: 'Успешно вышли из аккаунта' };
  }
}
