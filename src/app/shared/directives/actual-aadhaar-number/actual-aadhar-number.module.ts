import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualAadhaarNumberDirective } from './actual-aadhar-number.directive';
import { SimpleModalModule, defaultSimpleModalOptions } from 'ngx-simple-modal';
import { ActualAadhaarNumberComponent } from './actual-aadhar-number.component';
import { TooltipModule } from '../tooltip/tooltip.module';


@NgModule({
  declarations: [ActualAadhaarNumberDirective, ActualAadhaarNumberComponent],
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
    ActualAadhaarNumberComponent
  ],
  exports: [ActualAadhaarNumberDirective]
})
export class ActualAadhaarNumberModule {

}
