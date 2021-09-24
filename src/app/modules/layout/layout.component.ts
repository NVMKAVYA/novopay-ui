import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Router, RouterEvent, RouteConfigLoadStart } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  searchTypes: any = [];
  currentSearchType: any;
  clicked: boolean = false;
  currentUser: any = {};
  office: any = {};
  searchText: string;



  version: any = '(Version: novobank-v2.3.19.0)';
  private scroll: PerfectScrollbarComponent;
  @ViewChild('perfectScroll', { static: false }) set perfectScroll(perfectScroll: PerfectScrollbarComponent) {
    if (perfectScroll) {
      this.scroll = perfectScroll
      this.loader.addScrollbarState(this.scroll);
    }
  };

  constructor(private auth: AuthService, private http: HttpService, private loader: LoaderService, private router: Router, private toastr: ToastrService) {
    this.router.events.subscribe(
      (event: RouterEvent): void => {
        if (event instanceof RouteConfigLoadStart) {
          this.loader.show()
        }
      }
    );
  }

  ngOnInit(): void {
    this.searchTypes = ['Clients', 'KYC', 'Groups', 'Loans'];
    this.currentSearchType = 'Loans';
    this.currentUser = this.auth.userData;
    this.office = this.auth.office;
  }


  search(value) {
    if (value) {
      this.http.globalSearch(value,
        this.currentSearchType,
        true).subscribe(data => {
          if (data.length > 200) {
            data = data.slice(0, 199);
            this.toastr.warning("Searched query resulted more than 200 records, showing first 200 records.", 'Warning')
          } else if (data.length <= 0) {
            this.toastr.error("No data was found related to the search parameters entered.", 'Error')
          } else {
            if (data[0].entityType == "CLIENT") {
              this.router.navigate(['home/client/view', data[0].entityId]);
            }
            if (data[0].entityType == "LOAN") {
              this.router.navigate(['home/loan/view', data[0].entityId]);
            }
          };
        })
    }
  }


  logout() {
    this.auth.logout();
  }


}
