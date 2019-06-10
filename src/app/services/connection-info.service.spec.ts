import { TestBed } from '@angular/core/testing';

import { ConnectionInfoService } from './connection-info.service';

describe('ConnectionInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConnectionInfoService = TestBed.get(ConnectionInfoService);
    expect(service).toBeTruthy();
  });
});
