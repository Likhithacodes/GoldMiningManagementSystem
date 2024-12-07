import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeologicalDataComponent } from './geological-data.component';

describe('GeologicalDataComponent', () => {
  let component: GeologicalDataComponent;
  let fixture: ComponentFixture<GeologicalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeologicalDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeologicalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
