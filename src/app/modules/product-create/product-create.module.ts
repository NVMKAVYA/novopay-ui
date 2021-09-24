import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProductRoutingModule } from './product-create-routing.module';
import { CreateProductComponent } from './product-create.component';

import { NgWizardModule } from 'ng-wizard';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InputFieldModule } from '../../shared/components/input-field/input-field.module';
import { DropdownModule } from '../../shared/components/dropdown/dropdown.module';
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
