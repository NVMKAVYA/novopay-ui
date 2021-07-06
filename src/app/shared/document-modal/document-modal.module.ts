import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModalComponent } from './document-modal.component';
import { SimpleModalModule } from 'ngx-simple-modal';



@NgModule({
  declarations: [DocumentModalComponent],
  imports: [
    CommonModule,
    SimpleModalModule.forRoot({ container: 'modal-container' })
  ],
  entryComponents: [
    DocumentModalComponent
  ],
  exports: [DocumentModalComponent, SimpleModalModule]
})
export class DocumentModalModule { }
