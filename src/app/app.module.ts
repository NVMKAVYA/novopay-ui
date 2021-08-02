import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//dependencies
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserIdleModule } from 'angular-user-idle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


//helpers
import { JwtInterceptor } from './helpers/jwt.interceptors/jwt.interceptors.service';
import { ErrorInterceptor } from './helpers/error.interceptors/error.interceptors.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UserIdleModule.forRoot({ idle: 15 * 60, timeout: 10, ping: 15 * 60 }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000, positionClass: 'toast-top-right',
      closeButton: true
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
  {
    provide: "windowObject",
    useValue: window
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
