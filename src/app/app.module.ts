import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//modules
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { UserIdleModule } from 'angular-user-idle';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


import { NgxPaginationModule } from 'ngx-pagination'; 
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { DpDatePickerModule } from 'ng2-date-picker';
 

//components
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { CreateClientComponent } from './components/create-client/create-client.component';

//helpers
import { JwtInterceptor } from './helpers/jwt.interceptors/jwt.interceptors.service';
import { ErrorInterceptor } from './helpers/error.interceptors/error.interceptors.service';

// pipes
import { SearchPipe } from 'src/app/pipes/search/search.pipe';
import { DatePipe } from '@angular/common';

import { TooltipDirective } from 'src/app/directives/tootip.directive';

import { DualEntryComponent } from './components/dual-entry/dual-entry.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// }

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.arrows
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateClientComponent,
    SearchPipe,
    DualEntryComponent,
    DropdownComponent,
    DocumentUploadComponent,
    TooltipDirective
  ],
  imports: [
    BrowserModule,AppRoutingModule,HttpClientModule,FormsModule,NgxWebstorageModule.forRoot(),
    UserIdleModule.forRoot({idle: 30 * 60 , timeout: 10, ping: 15 * 60}),PerfectScrollbarModule,
    BrowserAnimationsModule,ToastrModule.forRoot({timeOut: 10000,positionClass: 'toast-top-right',
    preventDuplicates: true,closeButton : true}),NgxPaginationModule, 
    NgWizardModule.forRoot(ngWizardConfig),ReactiveFormsModule,DpDatePickerModule 
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
  { provide: HTTP_INTERCEPTORS, 
    useClass: ErrorInterceptor,
     multi: true },
  DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
