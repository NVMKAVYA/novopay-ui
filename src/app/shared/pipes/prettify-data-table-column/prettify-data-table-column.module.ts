import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrettifyDataTableColumnPipe } from './prettify-data-table-column.pipe';



@NgModule({
  declarations: [PrettifyDataTableColumnPipe],
  imports: [
    CommonModule
  ],
  exports: [PrettifyDataTableColumnPipe]
})
export class PrettifyDataTableColumnModule { }
