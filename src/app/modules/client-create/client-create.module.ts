import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateClientRoutingModule } from './client-create-routing.module';
import { CreateClientComponent } from './client-create.component';

import { NgWizardModule, NgWizardConfig } from 'ng-wizard';
import { DatePipe } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TooltipModule } from '../../shared/directives/tooltip/tooltip.module';
import { InputFieldModule } from '../../shared/components/input-field/input-field.module';
import { DropdownModule } from '../../shared/components/dropdown/dropdown.module';

import { DualEntryComponent } from '../../shared/components/dual-entry/dual-entry.component';
import { DocumentUploadComponent } from '../../shared/components/add-document/add-document.component';

const ngWizardConfig: NgWizardConfig = {};

@NgModule({
  declarations: [
    CreateClientComponent,
    DualEntryComponent,
    DocumentUploadComponent
  ],
  imports: [
    CommonModule,
    CreateClientRoutingModule,
    NgWizardModule.forRoot(ngWizardConfig),
    PerfectScrollbarModule,
    InputFieldModule,
    DropdownModule,
    TooltipModule
  ],
  providers: [DatePipe]
})
export class CreateClientModule { }
