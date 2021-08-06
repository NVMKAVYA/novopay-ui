import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewClientRoutingModule } from './client-view-routing.module';
import { ViewClientComponent } from './client-view.component';
import { TooltipModule } from '../../shared/directives/tooltip/tooltip.module';
import { StatusColourModule } from '../../shared/pipes/status-colour/status-colour.module';
import { HasPermissionModule } from 'src/app/shared/directives/has-permission/has-permission.module';
import { DocumentModalModule } from 'src/app/shared/directives/document-modal/document-modal.module';
import { ActualAadhaarNumberModule } from 'src/app/shared/directives/actual-aadhaar-number/actual-aadhar-number.module';
import { OrderModule } from 'ngx-order-pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { AadhaarMaskPipe } from 'src/app/pipes/aadhaar-mask/aadhaar-mask.pipe';

@NgModule({
  declarations: [ViewClientComponent,AadhaarMaskPipe],
  imports: [
    CommonModule,
    ViewClientRoutingModule,
    TooltipModule,
    StatusColourModule,
    HasPermissionModule,
    DocumentModalModule,
    ActualAadhaarNumberModule,
    OrderModule,
    PerfectScrollbarModule,
    FormsModule
  ]
})
export class ViewClientModule { 
}
