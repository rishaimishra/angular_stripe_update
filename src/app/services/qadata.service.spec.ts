import { TestBed } from '@angular/core/testing';

import { QadataService } from './qadata.service';

describe('QadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QadataService = TestBed.get(QadataService);
    expect(service).toBeTruthy();
  });
});
