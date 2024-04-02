import { AnnoucementsModule } from './annoucements.module';

describe('AnnoucementsModule', () => {
  let annoucementsModule: AnnoucementsModule;

  beforeEach(() => {
    annoucementsModule = new AnnoucementsModule();
  });

  it('should create an instance', () => {
    expect(annoucementsModule).toBeTruthy();
  });
});
