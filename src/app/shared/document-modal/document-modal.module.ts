import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModalComponent } from './document-modal.component';
import { SimpleModalModule, defaultSimpleModalOptions } from 'ngx-simple-modal';



@NgModule({
  declarations: [DocumentModalComponent],
  imports: [
    CommonModule,
    SimpleModalModule.forRoot({ container: 'modal-container' }, {
      ...defaultSimpleModalOptions, ...{
        closeOnEscape: true,
        closeOnClickOutside: true,
        autoFocus: true
      }
    })
  ],
  entryComponents: [
    DocumentModalComponent
  ],
  exports: [DocumentModalComponent, SimpleModalModule]
})
export class DocumentModalModule { }
