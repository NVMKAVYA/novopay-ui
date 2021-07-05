import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProductRoutingModule } from './create-product-routing.module';
import { CreateProductComponent } from './create-product.component';

import { NgWizardModule } from 'ng-wizard';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InputFieldModule } from '../../shared/input-field/input-field.module';
import { DropdownModule } from '../../shared/dropdown/dropdown.module';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    CreateProductComponent
  ],
  imports: [
    CommonModule,
    CreateProductRoutingModule,
    NgWizardModule,
    PerfectScrollbarModule,
    InputFieldModule,
    DropdownModule
  ],
  providers: [DatePipe]
})
export class CreateProductModule { }
