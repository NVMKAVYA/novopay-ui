import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanViewRoutingModule } from './loan-view-routing.module';
import { LoanViewComponent } from './loan-view.component';

import { StatusColourModule } from '../../shared/pipes/status-colour/status-colour.module';
import { DatePipe } from '@angular/common';
import { HasPermissionModule } from 'src/app/shared/directives/has-permission/has-permission.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [LoanViewComponent],
  imports: [
    CommonModule,
    LoanViewRoutingModule,
    StatusColourModule,
    HasPermissionModule,
    PerfectScrollbarModule
  ],
  providers: [DatePipe]
})
export class LoanViewModule { }
