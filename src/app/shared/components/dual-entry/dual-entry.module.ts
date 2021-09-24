import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DualEntryComponent } from './dual-entry.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [DualEntryComponent],
  exports: [DualEntryComponent, CommonModule, ReactiveFormsModule]
})
export class DualEntryModule { }
