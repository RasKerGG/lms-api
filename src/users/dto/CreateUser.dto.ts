import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
