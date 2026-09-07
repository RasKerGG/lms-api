import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from '../dto/CreateCourse.dto';
import { UpdateCourseDto } from '../dto/UpdateCourse.dto';

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
  async updateCourse(dto: UpdateCourseDto, courseId: string) {
    await this.prismaService.course.update({
      where: {
        courseId,
      },
      data: dto,
    });
  }
}
