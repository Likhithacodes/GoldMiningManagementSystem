import { TestBed } from '@angular/core/testing';

import { CostManagementService } from './cost-management.service';

describe('CostManagementService', () => {
  let service: CostManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
