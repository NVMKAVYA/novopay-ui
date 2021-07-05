import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputFieldComponent } from './input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';



@NgModule({
  imports: [CommonModule, ReactiveFormsModule, DpDatePickerModule],
  declarations: [InputFieldComponent],
  exports: [InputFieldComponent, ReactiveFormsModule]
})
export class InputFieldModule { }
