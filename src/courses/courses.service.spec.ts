import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './services/courses.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
