import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewClientRoutingModule } from './view-client-routing.module';
import { ViewClientComponent } from './view-client.component';
import { TooltipModule } from '../../shared/tooltip/tooltip.module';
import { StatusColourModule } from '../../shared/status-colour/status-colour.module';
import { HasPermissionModule } from 'src/app/shared/has-permission/has-permission.module';
import { DocumentModalModule } from 'src/app/shared/document-modal/document-modal.module';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
  declarations: [ViewClientComponent],
  imports: [
    CommonModule,
    ViewClientRoutingModule,
    TooltipModule,
    StatusColourModule,
    HasPermissionModule,
    DocumentModalModule,
    OrderModule
  ]
})
export class ViewClientModule { }
