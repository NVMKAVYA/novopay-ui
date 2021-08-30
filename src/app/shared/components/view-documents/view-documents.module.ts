import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDocumentsComponent } from './view-documents/view-documents.component';
import { DocumentModalModule } from 'src/app/shared/directives/document-modal/document-modal.module';
import { HasPermissionModule } from 'src/app/shared/directives/has-permission/has-permission.module';
import { TooltipModule } from '../../../shared/directives/tooltip/tooltip.module';



@NgModule({
  declarations: [ViewDocumentsComponent],
  imports: [
    CommonModule,
    DocumentModalModule,
    HasPermissionModule,
    TooltipModule
  ],
  exports: [ViewDocumentsComponent, HasPermissionModule, DocumentModalModule]
})
export class ViewDocumentsModule { }
