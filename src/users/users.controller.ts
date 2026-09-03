import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { RolesGuard } from './guards/roles.guard';
import { Role } from '@prisma/client';
import { PaginationDto } from './dto/Pagination.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get('/me')
  async getMe(@Req() req) {
    return this.usersService.findUser(req.user?.id);
  }

  @Get(':uuid')
  @Roles(Role.ADMIN)
  async getUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findUser(uuid);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req) {
    if (req.user.role !== Role.ADMIN && req.user.id !== uuid) {
      throw new ForbiddenException('Вы не можете удалить другого пользователя если вы не админ');
    }

    return this.usersService.deleteUser(uuid);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.getAllUsers(paginationDto);
  }

  @Put(':uuid')
  @Roles(Role.ADMIN)
  async updateUser(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(uuid, dto);
  }
}
