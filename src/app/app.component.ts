import { Component, OnInit } from '@angular/core';

import { LoginCredentials } from 'src/app/models/LoginCredentials';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpService } from 'src/app/services/http/http.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DataService } from 'src/app/services/data/data.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { LoaderState } from 'src/app/models/Loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    loginCredentials: LoginCredentials;
    isUserLoggedIn: Boolean = false;
    // authenticationFailed: any = false;
    isLoginButtonDisabled: Boolean = false;
    // isAccountLocked: any = false;
    formInvalid: Boolean = false;
    searchTypes: any = [];
    currentSearchType: any;
    version: any = '(Version: novobank-v2.3.19.0)';
    releasedate:any = '12-Jan-2021';
    clicked :Boolean = false;
    currentUser : any = {};
    office :any = {};
    loading : boolean = false;
    private loaderSubscription : Subscription;
  
    constructor(private auth : AuthService, private http: HttpService, 
      private local: LocalStorageService, private global: DataService, private router: Router,
      private loader : LoaderService) {
    }
  
    ngOnInit(): void {
      this.loginCredentials = new LoginCredentials('', '');
      this.router.navigate(['']);
      this.searchTypes = [ 'Clients', 'KYC', 'Groups' , 'Loans'];
      this.currentSearchType = 'Loans';
      
      this.loaderSubscription = this.loader.loaderState.subscribe((state: LoaderState) => {
           this.loading = state.show;
      });
    }

    ngOnDestroy() {
      this.loaderSubscription.unsubscribe();
    }
  
    login(form: { form: { valid: any; }; }): any {
        // this.authenticationFailed = false;
        // this.sessionTimedout = false;
        // this.isAccountLocked = false;
        if (form.form.valid) {
            this.isLoginButtonDisabled = true;
            this.formInvalid = false;
            this.auth.login(this.loginCredentials).subscribe( data =>{
                   this.isUserLoggedIn =  this.auth.isUserLoggedIn;
                   this.isLoginButtonDisabled = false;
                   this.currentUser = data[1];
                   this.office = data[2];
                   this.loginCredentials = new LoginCredentials('', '');
                   this.local.store('configurations', data[0]);
                   this.checkRoleForDashboard(this.global.getConfiguration('bc-dashboard-task-roles')[0].value);
                   console.log("Logged In");
            },error =>{
                   this.isLoginButtonDisabled = false;
                   this.loginCredentials = new LoginCredentials('', '');
                   console.log("error", error);
            })
        }else{
          this.formInvalid =  true;
        }       
    }

    checkRoleForDashboard(bcDashBoardRoles):any{
        if(bcDashBoardRoles){
          if(bcDashBoardRoles.split(',').indexOf(this.auth.userData.roles[0].name) > -1){
            this.router.navigate(['/home']);
          }else{
            this.router.navigate(['/home']);
          }
        }else{
          // TODO
        }
    }

    logout(){
      this.auth.logout().subscribe(data =>{
        this.isUserLoggedIn = this.auth.isUserLoggedIn;
      },error =>{

      })
    }
  }
