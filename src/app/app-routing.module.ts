import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
  { path: 'home', loadChildren: () => import('./modules/layout/layout.module').then(m => m.LayoutModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
