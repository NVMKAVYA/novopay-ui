import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from 'src/app/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent, 
    SearchPipe 
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxPaginationModule ,
    FormsModule
  ]
})
export class DashboardModule { }
