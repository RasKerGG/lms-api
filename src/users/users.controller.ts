import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';

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
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
