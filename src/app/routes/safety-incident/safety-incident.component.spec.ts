import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyIncidentComponent } from './safety-incident.component';

describe('SafetyIncidentComponent', () => {
  let component: SafetyIncidentComponent;
  let fixture: ComponentFixture<SafetyIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyIncidentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SafetyIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
