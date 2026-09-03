import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { PasswordUtil } from '../common/utils/password.util';
import { Prisma } from '@prisma/client';

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

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
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

  async getAllUsers(paginationDto) {
    const { skip, limit, sortBy, sortOrder } = paginationDto;

    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy,
        omit: {
          password: true,
          refreshTokenHash: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        skip,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: skip > 0,
      },
    };
  }

  async updateRefreshToken(id: string, hash: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshTokenHash: hash,
      },
    });
  }

  async getRefreshToken(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user?.refreshTokenHash || null;
  }

  async clearRefreshToken(id: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }
}
