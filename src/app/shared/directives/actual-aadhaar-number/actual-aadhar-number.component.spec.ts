import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualAadhaarNumberComponent } from './actual-aadhar-number.component';

describe('ActualAadhaarNumberComponent', () => {
  let component: ActualAadhaarNumberComponent;
  let fixture: ComponentFixture<ActualAadhaarNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualAadhaarNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualAadhaarNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
