import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateClientRoutingModule } from './create-client-routing.module';
import { CreateClientComponent } from './create-client.component';

import { NgWizardModule, NgWizardConfig } from 'ng-wizard';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TooltipDirective } from 'src/app/directives/tootip.directive';
import { InputFieldModule } from '../shared/input-field/input-field.module';
import { DropdownModule } from '../shared/dropdown/dropdown.module';

import { DualEntryComponent } from '../shared/dual-entry/dual-entry.component';
import { DocumentUploadComponent } from '../shared/document-upload/document-upload.component';

const ngWizardConfig: NgWizardConfig = {};

@NgModule({
  declarations: [
    CreateClientComponent,
    DualEntryComponent,
    DocumentUploadComponent,
    TooltipDirective
  ],
  imports: [
    CommonModule,
    CreateClientRoutingModule,
    ReactiveFormsModule,
    NgWizardModule.forRoot(ngWizardConfig),
    PerfectScrollbarModule,
    InputFieldModule,
    DropdownModule
  ],
  providers: [DatePipe]
})
export class CreateClientModule { }
