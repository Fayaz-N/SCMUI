import { TestBed } from '@angular/core/testing';

import { MprService } from './mpr.service';

describe('MprService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MprService = TestBed.get(MprService);
    expect(service).toBeTruthy();
  });
});
