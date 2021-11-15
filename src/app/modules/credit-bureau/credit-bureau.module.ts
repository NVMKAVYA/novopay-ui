import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditBureauRoutingModule } from './credit-bureau-routing.module';
import { CreditBureauComponent } from './credit-bureau.component';




@NgModule({
  declarations: [CreditBureauComponent],
  imports: [
    CommonModule,
    CreditBureauRoutingModule

  ]
})
export class CreditBureauModule {
  
 }
