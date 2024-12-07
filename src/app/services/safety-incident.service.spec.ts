import { TestBed } from '@angular/core/testing';

import { SafetyIncidentService } from './safety-incident.service';

describe('SafetyIncidentService', () => {
  let service: SafetyIncidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafetyIncidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
