import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownComponent } from './dropdown.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports:      [ CommonModule, ReactiveFormsModule ],
  declarations: [ DropdownComponent ],
  exports:      [ DropdownComponent, CommonModule, ReactiveFormsModule ]
})
export class DropdownModule { }
