import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewClientRoutingModule } from './client-view-routing.module';
import { ViewClientComponent } from './client-view.component';
import { TooltipModule } from '../../shared/tooltip/tooltip.module';
import { StatusColourModule } from '../../shared/status-colour/status-colour.module';
import { HasPermissionModule } from 'src/app/shared/has-permission/has-permission.module';
import { DocumentModalModule } from 'src/app/shared/document-modal/document-modal.module';
import { ActualAadhaarNumberModule } from 'src/app/shared/actual-aadhaar-number/actual-aadhar-number.module';
import { OrderModule } from 'ngx-order-pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


@NgModule({
  declarations: [ViewClientComponent],
  imports: [
    CommonModule,
    ViewClientRoutingModule,
    TooltipModule,
    StatusColourModule,
    HasPermissionModule,
    DocumentModalModule,
    ActualAadhaarNumberModule,
    OrderModule,
    PerfectScrollbarModule
  ]
})
export class ViewClientModule { }
