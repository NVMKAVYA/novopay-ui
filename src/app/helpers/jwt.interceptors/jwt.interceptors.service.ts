import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(private auth: AuthService, private loader: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    setTimeout(() => { this.loader.show(); }, 0)
    if (this.auth.userData && this.auth.userData.sessionKey) {
      return next.handle(req.clone({
        setHeaders: {
          'Novobank-TenantId': 'default',
          'Authorization': "Custom " + this.auth.userData.sessionKey,
          'OTP': this.auth.getOtp(),
          'Originator': this.auth.userData.userId.toString()
        }
      })).pipe(finalize(() => {
        this.hideLoader();
      }));
    } else {
      return next.handle(req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Novobank-TenantId': 'default'
        },
      })).pipe(finalize(() => {
        this.hideLoader();
      }));
    }
  }

  private hideLoader() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      setTimeout(() => { this.loader.hide(); }, 1000)
    }
  }

}
