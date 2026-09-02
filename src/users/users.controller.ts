import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { RolesGuard } from './guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get(':uuid')
  async getUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findUser(uuid);
  }

  @Delete(':uuid')
  async deleteUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.deleteUser(uuid);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Put(':uuid')
  async updateUser(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(uuid, dto);
  }
}
