import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditBureauComponent } from './credit-bureau.component';


const routes: Routes = [{ path: '', component: CreditBureauComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditBureauRoutingModule { }
