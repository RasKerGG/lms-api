import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { PasswordUtil } from '../common/utils/password.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...dto,
        password: await PasswordUtil.hashPassword(dto.password),
      },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async findUser(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.findUser(id);

    if (user != null) {
      return this.prisma.user.delete({
        where: {
          id,
        },
      });
    } else {
      throw new NotFoundException('User is not found');
    }
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
