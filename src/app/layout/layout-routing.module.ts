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
			    loadChildren: () => import('../create-client/create-client.module').then(m => m.CreateClientModule) 
			}

    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
