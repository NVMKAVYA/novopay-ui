import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';

const routes: Routes = [{
	path: '',
	component: LayoutComponent,
	children: [
		{
			path: '',
			loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule)
		},
		{
			path: 'client/create',
			loadChildren: () => import('../client-create/client-create.module').then(m => m.CreateClientModule)
		},
		{
			path: 'product/create',
			loadChildren: () => import('../create-product/create-product.module').then(m => m.CreateProductModule)
		},
		{
			path: 'client/view/:id',
			loadChildren: () => import('../client-view/client-view.module').then(m => m.ViewClientModule)
		},
		{
			path: 'loan/view/:id',
			loadChildren: () => import('../loan-view/loan-view.module').then(m => m.LoanViewModule)
		}


	]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LayoutRoutingModule { }
