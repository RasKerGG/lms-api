import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './services/courses.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('CoursesController', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [CoursesService],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
