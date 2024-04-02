import { ListingModule } from './listing.module';

describe('ListingModule', () => {
  let listingModule: ListingModule;

  beforeEach(() => {
    listingModule = new ListingModule();
  });

  it('should create an instance', () => {
    expect(listingModule).toBeTruthy();
  });
});
