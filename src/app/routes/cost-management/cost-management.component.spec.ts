import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostManagementComponent } from './cost-management.component';

describe('CostManagementComponent', () => {
  let component: CostManagementComponent;
  let fixture: ComponentFixture<CostManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CostManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
