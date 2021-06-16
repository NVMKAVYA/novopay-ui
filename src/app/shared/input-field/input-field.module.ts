import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputFieldComponent } from './input-field.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports:      [ CommonModule, ReactiveFormsModule ],
  declarations: [ InputFieldComponent ],
  exports:      [ InputFieldComponent, CommonModule, ReactiveFormsModule ]
})
export class InputFieldModule { }
