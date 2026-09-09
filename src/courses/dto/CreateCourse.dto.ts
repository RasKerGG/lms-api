import { Level, Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(Level)
  @IsNotEmpty()
  level: Level;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
