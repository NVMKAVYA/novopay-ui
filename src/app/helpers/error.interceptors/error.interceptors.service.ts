import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService, private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err) => {
            err.error = typeof err.error === 'string' ? JSON.parse(err.error.replace(/\\/g, "")) : err.error;
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.auth.logout();
            }
            if (err.url.includes("/authentication")) {
                this.toastr.error(err.error.errors[0].developerMessage, 'Error', {
                    timeOut: 5000
                })
            } else {
                this.toastr.error(err.error.errors[0].developerMessage, 'Error',)
            }
            return throwError(err);
        }))
    }
}
