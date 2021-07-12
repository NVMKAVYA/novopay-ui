import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constants } from 'src/app/models/Constants';
import { ClientStatus } from 'src/app/models/clientStatus';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SimpleModalService } from 'ngx-simple-modal';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {

  clientId: number;
  clientImage: SafeResourceUrl;
  client: any;
  clientSummary: any = {};
  activeLoanAccounts: any = [];
  closedLoanAccounts: any = [];
  showActiveLoans: boolean = true;
  primaryLoanProducts: any = [];
  dateFormat: any = Constants.dateFormat1;
  clientStatus: ClientStatus = new ClientStatus();
  tab: number = 1;
  enableMelEditDemographics: boolean = false;
  buttonsArray = {
    options: [{
      name: "button.clientscreenreports"
    }],
    singlebuttons: null
  };
  addresses: any = [];

  constructor(private http: HttpService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private auth: AuthService, private modal: SimpleModalService) { }

  ngOnInit(): void {

    this.clientId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.enableMelEditDemographics = this.auth.getConfiguration("enable-edit-demographic-for-mel").enabled;

    this.http.getclientResource(this.clientId, null, null, true).subscribe(data => {
      this.client = data;
      if (this.client.imagePresent) {
        this.http.getClientImage(this.clientId, 'maxHeight=300').subscribe(data => {
          this.clientImage = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        })
      }
      let buttons;
      if (this.clientStatus.statusKnown(data.status.value)) {
        buttons = this.clientStatus.getStatus(data.status.value);
      }

      if (data.status.value == "Pending" || data.status.value == "Active") {
        if (!data.staffId) {
          buttons.push(this.clientStatus.getStatus("Assign Staff"));
        }
      }

      if (this.auth.getConfiguration('enable-new-loan-button-for-client').enabled) {
        buttons.push(this.clientStatus.getStatus("New Loan"));
      }
      this.buttonsArray.singlebuttons = buttons;
    })

    this.http.runReportsResource('ClientSummary', 'false', this.clientId).subscribe(data => {
      this.clientSummary = data[0];
      // edit demo button
    })

    this.http.clientAccountResource(this.clientId).subscribe(data => {
      data.loanAccounts.forEach(e => {
        if (this.isLoanClosed(e, false)) {
          this.activeLoanAccounts.push(e)
        } else {
          this.closedLoanAccounts.push(e)
        }
      });

    })

    this.http.loanProductResource().subscribe(data => {
      if (data.length) {
        data.forEach(e => {
          if (e.loanClassificationType && e.loanClassificationType.value === 'Primary') {
            this.primaryLoanProducts.push(e.id);
          }
        });
      }
    })

  }

  setTab(tab: number) {
    this.tab = tab;
  }

  isLoanClosed = function (account, close) {
    if (account.status.code === "loanStatusType.closed.written.off" ||
      account.status.code === "loanStatusType.closed.obligations.met" ||
      account.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
      account.status.code === "loanStatusType.withdrawn.by.client" ||
      account.status.code === "loanStatusType.foreclosure" ||
      account.status.code === "loanStatusType.rejected" ||
      account.status.code === "loanStatusType.death.foreclosure" ||
      account.status.code === "loanStatusType.cancelsanction" ||
      account.status.code === "loanStatusType.death.coApplicant.foreclosure") {
      return close;
    } else {
      return !close;
    }
  };

  isPrimaryLoan = function (id) {
    if (this.primaryLoanProducts.indexOf(id) > -1) {
      return true;
    }
  };

  getAddresses = function () {
    this.http.addressResource('clients', this.clientId).subscribe(data => {
      this.addresses = data;
    })
  };

}
