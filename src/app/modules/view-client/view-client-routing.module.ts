import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewClientComponent } from './view-client.component';

const routes: Routes = [{ path: '', component: ViewClientComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewClientRoutingModule { }
