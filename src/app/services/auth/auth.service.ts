import { Injectable } from '@angular/core';

import { HttpService } from 'src/app/services/http/http.service';
import * as JsEncryptModule from 'jsencrypt';
import { UserIdleService } from 'angular-user-idle';
// import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { LoginCredentials } from 'src/app/models/LoginCredentials';
import { Router } from '@angular/router';

declare var jsSHA: any;

@Injectable({ providedIn: 'root' })

export class AuthService {

    private currentUserData: any = {};
    private bc: boolean = false;
    private subsidiary: boolean = false;
    private userLoggedIn: boolean = false;
    private officeDetails: any = {};
    private configurations: any = {};
    private permissionsList: any = [];
    private dmsUrl: string;

    constructor(private http: HttpService, private userIdle: UserIdleService, private router: Router) { }
    //getters
    public get userData(): any {
        return this.currentUserData;
    }

    public get isBC(): any {
        return this.bc;
    }

    public get isSubsidiary(): any {
        return this.subsidiary;
    }

    public get isUserLoggedIn(): any {
        return this.userLoggedIn;
    }

    public get office(): any {
        return this.officeDetails;
    }

    public set setDmsUrl(url: string) {
        this.dmsUrl = url;
    }

    public get getDmsUrl() {
        return this.dmsUrl;
    }

    public login(credentials: LoginCredentials) {
        return this.http.cryptoResource('getpublicrsakey').pipe(concatMap((data1: any) => {
            let encrypt = new JsEncryptModule.JSEncrypt();
            encrypt.setPublicKey(data1.keyValue);
            let encryptedPassword = encrypt.encrypt(credentials.password + ':' + new Date().getTime());
            if (encryptedPassword) {
                return this.http.authentication({ username: credentials.username, password: encryptedPassword })
            } else {
                //TODO
            }
        })).pipe(concatMap((data2: any) => {
            if (data2.authenticated) {
                this.currentUserData = data2;
                this.permissionsList = this.currentUserData.permissions;
                if (!data2.shouldRenewPassword) {
                    // let bases = this.local.retrieve('bases');
                    // if(bases) { // TODO
                    //     bases = this.traverse(JSON.parse(atob(bases)));
                    //     this.local.store('bases', btoa(JSON.stringify(bases)));
                    // }else{
                    //     //TODO
                    // }
                    this.userIdle.startWatching();
                    this.userIdle.onTimerStart().subscribe();
                    this.userIdle.onTimeout().subscribe(() => {
                        this.logout();
                    });
                    const observables = [this.http.officeResource(data2.officeId), this.http.configurationResource()];
                    return forkJoin(observables);
                } else {
                    //TODO
                }
            } else {
                //TODO
            }
        })).pipe(map((data3: any) => {
            this.officeDetails = data3[0];
            this.bc = data3[0].officeLevel.name.toLowerCase().indexOf("bc") > -1 ? true : false;
            this.subsidiary = data3[0].subsidiary;
            this.userLoggedIn = true;
            this.configurations = data3[1];
            this.checkRoleForDashboard(this.getConfiguration('bc-dashboard-task-roles').value);
            return true;
        }))
    }

    private checkRoleForDashboard(bcDashBoardRoles): any {
        if (bcDashBoardRoles) {
            if (bcDashBoardRoles.split(',').indexOf(this.currentUserData.roles[0].name) > -1) {
                this.router.navigate(['/home']);
            } else {
                this.router.navigate(['/home']);
            }
        } else {
            // TODO
        }
    }

    public logout(): any {
        this.http.logoutResource().subscribe(() => {
            this.currentUserData = {};
            this.bc = false;
            this.subsidiary = false;
            this.userLoggedIn = false;
            this.userIdle.stopWatching();
            this.router.navigate(['/']);
            return true;
        })
    }

    public getConfiguration(config: string): any {
        let globalData;
        globalData = this.configurations.globalConfiguration.filter(function (element) {
            return element.name == config;
        })
        return globalData[0];
    }

    public hasPermission(permission: string): any {
        permission = permission.trim();
        if (this.permissionsList && this.permissionsList.includes("ALL_FUNCTIONS")) {
            return true;
        } else if (this.permissionsList && permission && permission != "") {
            if (permission.substring(0, 5) == "READ_" && this.permissionsList.includes("ALL_FUNCTIONS_READ")) {
                return true;
            } else if (this.permissionsList.includes(permission)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public getOtp() {
        var key = this.userData.key;
        var epoch = Math.round(new Date().getTime() / 1000.0);
        var time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, '0');

        var shaObj = new jsSHA("SHA-256", "HEX");
        shaObj.setHMACKey(key, "HEX");
        shaObj.update(time);
        var hmac = shaObj.getHMAC("HEX");

        if (hmac != 'KEY MUST BE IN BYTE INCREMENTS') {
            var offset = this.hex2dec(hmac.substring(hmac.length - 1));
        }

        var otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec('7fffffff')) + '';
        otp = (otp).substr(otp.length - 6, 6);
        return otp;
    }

    private leftpad(str, len, pad) {
        if (len + 1 >= str.length) {
            str = Array(len + 1 - str.length).join(pad) + str;
        }
        return str;
    }

    private dec2hex(s) {
        return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
    }

    private hex2dec(s) {
        return parseInt(s, 16);
    }

    // private traverse(o) {
    //     for (var i in o) {
    //         if (o.hasOwnProperty(i) && o[i] && i != 'this' && typeof o[i] != "function" && i.slice(0, 1) != '$' && i.slice(0, 1) != '_') {
    //             if (typeof (o[i]) == "object" && !(o[i] instanceof Array)) {
    //                 this.traverse(o[i]);
    //             } else if (o[i] instanceof Array) {
    //                 for (var j in o[i]) {
    //                     if (typeof (o[i][j]) == "object")
    //                         this.traverse(o[i][j])
    //                     else {
    //                         var value1 = this.parseDate(j, o[i][j]);
    //                         if (value1)
    //                             o[i][j] = value1;
    //                     }
    //                 }
    //             } else {
    //                 var value2 = this.parseDate(i, o[i]);
    //                 if (value2)
    //                     o[i] = value2;
    //             }
    //         }
    //     }
    //     return o;
    // };

    // private parseDate(key: string, value: moment.MomentInput) {
    //     if (typeof (value) == 'string' && moment(value, moment.ISO_8601, true).isValid()) {
    //         return new Date(value);
    //     } else
    //         return false;
    // };
}
