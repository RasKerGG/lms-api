import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtil } from '../common/utils/password.util';
import { RegisterDto } from './dto/register.dto';

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

  async login(user) {
    return this.generateTokens(user);
  }

  async generateTokens(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
