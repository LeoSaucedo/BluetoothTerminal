import { TestBed } from '@angular/core/testing';

import { BLEFunctionsService } from './blefunctions.service';

describe('BLEFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BLEFunctionsService = TestBed.get(BLEFunctionsService);
    expect(service).toBeTruthy();
  });
});
