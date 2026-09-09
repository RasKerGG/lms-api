import { Level, Status } from '@prisma/client';
import { PaginationDto } from '../../common/dto/Pagination.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum SortBy {
  NAME = 'name',
  LEVEL = 'level',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class CoursesPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy: SortBy = SortBy.NAME;

  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsString()
  category?: string;
}
