import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateClientRoutingModule } from './create-client-routing.module';
import { CreateClientComponent } from './create-client.component';

import { NgWizardModule, NgWizardConfig } from 'ng-wizard';
import { DatePipe } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TooltipModule } from '../../shared/tooltip/tooltip.module';
import { InputFieldModule } from '../../shared/input-field/input-field.module';
import { DropdownModule } from '../../shared/dropdown/dropdown.module';

import { DualEntryComponent } from '../../shared/dual-entry/dual-entry.component';
import { DocumentUploadComponent } from '../../shared/document-upload/document-upload.component';

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
