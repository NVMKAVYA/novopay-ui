import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanViewRoutingModule } from './loan-view-routing.module';
import { LoanViewComponent } from './loan-view.component';

import { StatusColourModule } from '../../shared/pipes/status-colour/status-colour.module';

@NgModule({
  declarations: [LoanViewComponent],
  imports: [
    CommonModule,
    LoanViewRoutingModule,
    StatusColourModule
  ]
})
export class LoanViewModule { }
