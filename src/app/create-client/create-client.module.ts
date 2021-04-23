import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateClientRoutingModule } from './create-client-routing.module';
import { CreateClientComponent } from './create-client.component';

import { NgWizardModule, NgWizardConfig} from 'ng-wizard';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DpDatePickerModule } from 'ng2-date-picker';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TooltipDirective } from 'src/app/directives/tootip.directive';

import { DualEntryComponent } from '../components/dual-entry/dual-entry.component';
import { DropdownComponent } from '../components/dropdown/dropdown.component';
import { DocumentUploadComponent } from '../components/document-upload/document-upload.component';

const ngWizardConfig: NgWizardConfig = {};

@NgModule({
  declarations: [
    CreateClientComponent,
    DualEntryComponent,
    DropdownComponent,
    DocumentUploadComponent,
    TooltipDirective
  ],
  imports: [
    CommonModule,
    CreateClientRoutingModule,
    ReactiveFormsModule,
    NgWizardModule.forRoot(ngWizardConfig),
    DpDatePickerModule ,
    PerfectScrollbarModule
  ],
  providers: [DatePipe]
})
export class CreateClientModule { }
