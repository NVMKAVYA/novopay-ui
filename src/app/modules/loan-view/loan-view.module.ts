import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanViewRoutingModule } from './loan-view-routing.module';
import { LoanViewComponent } from './loan-view.component';

import { StatusColourModule } from '../../shared/pipes/status-colour/status-colour.module';
import { DatePipe } from '@angular/common';
import { HasPermissionModule } from 'src/app/shared/directives/has-permission/has-permission.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { FilterModule } from 'src/app/shared/pipes/filter/filter.module';
import { OrderModule } from 'ngx-order-pipe';
import { ViewDocumentsModule } from 'src/app/shared/components/view-documents/view-documents.module';
import { PrettifyDataTableColumnModule } from 'src/app/shared/pipes/prettify-data-table-column/prettify-data-table-column.module';
import { InputFieldModule } from '../../shared/components/input-field/input-field.module';
import { DropdownModule } from '../../shared/components/dropdown/dropdown.module';
import { DualEntryModule } from '../../shared/components/dual-entry/dual-entry.module';

@NgModule({
  declarations: [LoanViewComponent],
  imports: [
    CommonModule,
    LoanViewRoutingModule,
    StatusColourModule,
    HasPermissionModule,
    PerfectScrollbarModule,
    FormsModule,
    FilterModule,
    OrderModule,
    ViewDocumentsModule,
    PrettifyDataTableColumnModule,
    InputFieldModule,
    DropdownModule,
    DualEntryModule
  ],
  providers: [DatePipe]
})
export class LoanViewModule { }
