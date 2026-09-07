import { Level, Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category?: string;

  @IsEnum(Level)
  @IsNotEmpty()
  @IsOptional()
  level?: Level;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
