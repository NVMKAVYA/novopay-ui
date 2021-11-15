import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBureauComponent } from './credit-bureau.component';

describe('CreditBureauComponent', () => {
  let component: CreditBureauComponent;
  let fixture: ComponentFixture<CreditBureauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditBureauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditBureauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
