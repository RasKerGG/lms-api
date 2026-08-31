import { Role } from '@prisma/client';
import { IsString, IsStrongPassword, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
