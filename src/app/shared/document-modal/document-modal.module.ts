import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModalComponent } from './document-modal.component';
import { SimpleModalModule } from 'ngx-simple-modal';



@NgModule({
  declarations: [DocumentModalComponent],
  imports: [
    CommonModule,
    SimpleModalModule
  ],
  entryComponents: [
    DocumentModalComponent
  ],
  exports: [DocumentModalComponent]
})
export class DocumentModalModule { }
