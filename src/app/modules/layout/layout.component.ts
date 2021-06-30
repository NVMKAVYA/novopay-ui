import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from 'src/app/services/auth/auth.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  searchTypes: any = [];
  currentSearchType: any;
  clicked : boolean = false;
  currentUser : any = {};
  office : any = {};
  version: any = '(Version: novobank-v2.3.19.0)';
  private scroll: PerfectScrollbarComponent;
    @ViewChild('perfectScroll', { static: false }) set perfectScroll (perfectScroll: PerfectScrollbarComponent){
      if(perfectScroll){
        this.scroll = perfectScroll
        this.loader.addScrollbarState(this.scroll);
      }
    };

  constructor(private auth : AuthService, private loader : LoaderService) { }

  ngOnInit(): void {
    this.searchTypes = [ 'Clients', 'KYC', 'Groups' , 'Loans'];
    this.currentSearchType = 'Loans';
    this.currentUser = this.auth.userData;
    this.office = this.auth.office;
  }

  logout(){
    this.auth.logout();
  }

}
