import { CourseManageRoutingModule } from './course-manage-routing.module';

describe('CourseManageRoutingModule', () => {
  let courseManageRoutingModule: CourseManageRoutingModule;

  beforeEach(() => {
    courseManageRoutingModule = new CourseManageRoutingModule();
  });

  it('should create an instance', () => {
    expect(courseManageRoutingModule).toBeTruthy();
  });
});
