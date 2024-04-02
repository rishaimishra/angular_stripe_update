import { TestBed } from '@angular/core/testing';

import { CourseEditGurd } from './course-edit-gurd.service';

describe('CourseEditGurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourseEditGurd = TestBed.get(CourseEditGurd);
    expect(service).toBeTruthy();
  });
});
