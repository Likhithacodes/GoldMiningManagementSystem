import { TestBed } from '@angular/core/testing';

import { GeologicalDataService } from './geological-data.service';

describe('GeologicalDataService', () => {
  let service: GeologicalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeologicalDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
