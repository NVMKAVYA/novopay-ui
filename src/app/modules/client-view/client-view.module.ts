import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewClientRoutingModule } from './client-view-routing.module';
import { ViewClientComponent } from './client-view.component';
import { TooltipModule } from '../../shared/directives/tooltip/tooltip.module';
import { StatusColourModule } from '../../shared/pipes/status-colour/status-colour.module';
import { ActualAadhaarNumberModule } from 'src/app/shared/directives/actual-aadhaar-number/actual-aadhar-number.module';
import { OrderModule } from 'ngx-order-pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { AadhaarMaskPipe } from 'src/app/pipes/aadhaar-mask/aadhaar-mask.pipe';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ViewDocumentsModule } from 'src/app/shared/components/view-documents/view-documents.module';

@NgModule({
  declarations: [ViewClientComponent, AadhaarMaskPipe, UploadModalComponent],
  imports: [
    CommonModule,
    ViewClientRoutingModule,
    TooltipModule,
    StatusColourModule,
    ActualAadhaarNumberModule,
    OrderModule,
    PerfectScrollbarModule,
    FormsModule,
    ViewDocumentsModule
  ]
})
export class ViewClientModule {
}
