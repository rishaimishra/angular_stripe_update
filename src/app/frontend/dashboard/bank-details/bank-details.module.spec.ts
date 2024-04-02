import { BankDetailsModule } from './bank-details.module';

describe('BankDetailsModule', () => {
  let bankDetailsModule: BankDetailsModule;

  beforeEach(() => {
    bankDetailsModule = new BankDetailsModule();
  });

  it('should create an instance', () => {
    expect(bankDetailsModule).toBeTruthy();
  });
});
