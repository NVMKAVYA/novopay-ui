import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModalComponent } from './document-modal.component';
import { SimpleModalModule, defaultSimpleModalOptions } from 'ngx-simple-modal';
import { DocumentModalDirective } from './document-modal.directive';
import { TooltipModule } from '../tooltip/tooltip.module';


@NgModule({
  declarations: [DocumentModalComponent, DocumentModalDirective],
  imports: [
    CommonModule,
    TooltipModule,
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
  exports: [DocumentModalDirective]
})
export class DocumentModalModule { }
