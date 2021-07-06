import { Component, OnInit } from '@angular/core';

import { LoginCredentials } from 'src/app/models/LoginCredentials';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginCredentials: LoginCredentials;
  // isUserLoggedIn: Boolean = false;
  // authenticationFailed: any = false;
  isLoginButtonDisabled: Boolean = false;
  // isAccountLocked: any = false;
  formInvalid: Boolean = false;
  version: any = '(Version: novobank-v2.3.19.0)';
  releasedate: any = '12-Jan-2021';
  clicked: Boolean = false;
  currentUser: any = {};
  office: any = {};


  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.loginCredentials = new LoginCredentials('', '');
  }


  login(form: { form: { valid: any; }; }): any {
    // this.authenticationFailed = false;
    // this.sessionTimedout = false;
    // this.isAccountLocked = false;
    if (form.form.valid) {
      this.isLoginButtonDisabled = true;
      this.formInvalid = false;
      this.auth.login(this.loginCredentials).subscribe(data => {
      }, error => {
        this.isLoginButtonDisabled = false;
        this.loginCredentials = new LoginCredentials('', '');
        console.log("error", error);
      })
    } else {
      this.formInvalid = true;
    }
  }

  logout() {
    this.auth.logout().subscribe();
  }

}
