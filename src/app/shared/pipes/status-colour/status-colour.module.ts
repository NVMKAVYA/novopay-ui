import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusColourPipe } from './status-colour.pipe';



@NgModule({
  declarations: [StatusColourPipe],
  imports: [
    CommonModule
  ],
  exports: [StatusColourPipe]
})
export class StatusColourModule { }
