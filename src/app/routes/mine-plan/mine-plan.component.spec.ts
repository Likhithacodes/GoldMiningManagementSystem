import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinePlanComponent } from './mine-plan.component';

describe('MinePlanComponent', () => {
  let component: MinePlanComponent;
  let fixture: ComponentFixture<MinePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinePlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
