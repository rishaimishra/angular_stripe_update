import { ResellerModule } from './reseller.module';

describe('ResellerModule', () => {
  let resellerModule: ResellerModule;

  beforeEach(() => {
    resellerModule = new ResellerModule();
  });

  it('should create an instance', () => {
    expect(resellerModule).toBeTruthy();
  });
});
