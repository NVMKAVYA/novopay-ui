import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanViewRoutingModule } from './loan-view-routing.module';
import { LoanViewComponent } from './loan-view.component';

import { StatusColourModule } from '../../shared/pipes/status-colour/status-colour.module';
import { DatePipe } from '@angular/common';
import { HasPermissionModule } from 'src/app/shared/directives/has-permission/has-permission.module';

@NgModule({
  declarations: [LoanViewComponent],
  imports: [
    CommonModule,
    LoanViewRoutingModule,
    StatusColourModule,
    HasPermissionModule
  ],
  providers: [DatePipe]
})
export class LoanViewModule { }
