import { TestBed } from '@angular/core/testing';

import { IntegratedService } from './integrated.service';

describe('IntegratedService', () => {
  let service: IntegratedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegratedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
