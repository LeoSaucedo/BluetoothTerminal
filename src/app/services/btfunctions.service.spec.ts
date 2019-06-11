import { TestBed } from '@angular/core/testing';

import { BTFunctionsService } from './btfunctions.service';

describe('BTFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BTFunctionsService = TestBed.get(BTFunctionsService);
    expect(service).toBeTruthy();
  });
});
