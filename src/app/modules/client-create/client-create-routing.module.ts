import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateClientComponent } from './client-create.component';

const routes: Routes = [{ path: '', component: CreateClientComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateClientRoutingModule { }
