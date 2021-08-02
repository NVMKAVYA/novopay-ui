import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualEntryComponent } from './dual-entry.component';

describe('DualEntryComponent', () => {
  let component: DualEntryComponent;
  let fixture: ComponentFixture<DualEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DualEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
