import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewClientRoutingModule } from './view-client-routing.module';
import { ViewClientComponent } from './view-client.component';
import { TooltipModule } from '../../shared/tooltip/tooltip.module';
import { StatusColourModule } from '../../shared/status-colour/status-colour.module';


@NgModule({
  declarations: [ViewClientComponent],
  imports: [
    CommonModule,
    ViewClientRoutingModule,
    TooltipModule,
    StatusColourModule
  ]
})
export class ViewClientModule { }
