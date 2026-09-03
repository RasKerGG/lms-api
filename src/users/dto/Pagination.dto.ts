import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

enum SortBy {
  ID = 'id',
  EMAIL = 'email',
  NAME = 'name',
  ROLE = 'role',
  CREATED_AT = 'createdAt',
}

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.CREATED_AT;
}
