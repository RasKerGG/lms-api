import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from '../dto/CreateCourse.dto';
import { UpdateCourseDto } from '../dto/UpdateCourse.dto';
import { CoursesPaginationDto } from '../dto/CoursesPagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCourse(dto: CreateCourseDto, authorId: string) {
    return await this.prismaService.course.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        level: dto.level,
        status: dto.status || 'DRAFT',
        authorId,
      },
    });
  }

  async updateCourse(dto: UpdateCourseDto, id: string) {
    return await this.prismaService.course.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async getAllCourses(dto: CoursesPaginationDto) {
    const { sortBy, sortOrder, page = 1, limit = 10 } = dto;

    const where: Prisma.CourseWhereInput = {};

    if (dto.level) where.level = dto.level;
    if (dto.category) where.category = dto.category;
    if (dto.status) where.status = dto.status;

    return await this.prismaService.course.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      where,
    });
  }

  async getCourse(id: string) {
    return await this.prismaService.course.findUnique({
      where: { id },
    });
  }

  async deleteCourse(id: string) {
    const course = await this.getCourse(id);

    if (course) {
      return await this.prismaService.course.delete({
        where: { id },
      });
    } else {
      throw new NotFoundException('Course not found');
    }
  }
}
