import { EventAttendeeInfoModule } from './event-attendee-info.module';

describe('EventAttendeeInfoModule', () => {
  let eventAttendeeInfoModule: EventAttendeeInfoModule;

  beforeEach(() => {
    eventAttendeeInfoModule = new EventAttendeeInfoModule();
  });

  it('should create an instance', () => {
    expect(eventAttendeeInfoModule).toBeTruthy();
  });
});
