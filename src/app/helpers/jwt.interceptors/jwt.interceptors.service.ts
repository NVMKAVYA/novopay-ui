import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpParams, HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { finalize } from 'rxjs/operators';

declare var jsSHA: any;


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
          'OTP': this.getOtp(),
          'Originator': this.auth.userData.userId.toString()
        },
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

  hideLoader() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      setTimeout(() => { this.loader.hide(); }, 800)
    }
  }

  leftpad(str, len, pad) {
    if (len + 1 >= str.length) {
      str = Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
  }

  dec2hex(s) {
    return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
  }

  hex2dec(s) {
    return parseInt(s, 16);
  }

  getOtp() {
    var key = this.auth.userData.key;
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, '0');

    var shaObj = new jsSHA("SHA-256", "HEX");
    shaObj.setHMACKey(key, "HEX");
    shaObj.update(time);
    var hmac = shaObj.getHMAC("HEX");

    if (hmac != 'KEY MUST BE IN BYTE INCREMENTS') {
      var offset = this.hex2dec(hmac.substring(hmac.length - 1));
      //  var part1 = hmac.substr(0, offset * 2);
      //  var part2 = hmac.substr(offset * 2, 8);
      //  var part3 = hmac.substr(offset * 2 + 8, hmac.length - offset);
    }

    var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec('7fffffff')) + '';
    otp = (otp).substr(otp.length - 6, 6);
    return otp;
  }

}
