import { TestBed } from '@angular/core/testing';

import { MinePlanService } from './mine-plan.service';

describe('MinePlanService', () => {
  let service: MinePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
