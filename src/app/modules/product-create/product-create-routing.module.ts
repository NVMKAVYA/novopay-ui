import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateProductComponent } from './product-create.component';

const routes: Routes = [{ path: '', component: CreateProductComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateProductRoutingModule { }
