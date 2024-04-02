import { CourseManageModule } from './course-manage.module';

describe('CourseManageModule', () => {
  let courseManageModule: CourseManageModule;

  beforeEach(() => {
    courseManageModule = new CourseManageModule();
  });

  it('should create an instance', () => {
    expect(courseManageModule).toBeTruthy();
  });
});
