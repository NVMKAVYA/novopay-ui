import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constants } from 'src/app/models/Constants';
import { ClientStatus } from 'src/app/models/clientStatus';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-view-client',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.css']
})
export class ViewClientComponent implements OnInit {

  clientId: number;
  clientImage: SafeResourceUrl;
  client: any;
  clientSummary: any = {};
  activeLoanAccounts: any = [];
  closedLoanAccounts: any = [];
  showActiveLoans: boolean = true;
  updateDefaultSavings: boolean = false;
  enableEditDemographic: boolean = true;
  deathRequestPending: boolean = false;
  primaryLoanProducts: any = [];
  dateFormat: any = Constants.dateFormat1;
  clientStatus: ClientStatus = new ClientStatus();
  tab: number = 1;
  enableMelEditDemographics: boolean = false;
  showClientDemographicForMel: boolean = true;
  showDemoAuthButton: boolean = true;
  isBC: boolean = false;
  allowEditingOfDeathDate: boolean = false;
  editDemoPermission: string;
  clientAccounts: any;
  buttonsArray = {
    options: [{
      name: "button.clientscreenreports"
    }],
    singlebuttons: null
  };
  addresses: any = [];
  associatedWorkflows: any = [];
  showLoanAccountNumberHeader:boolean = false;

  constructor(private http: HttpService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private auth: AuthService, private form: FormService) { }

  ngOnInit(): void {

    this.clientId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.isBC = this.auth.isBC;
    this.enableMelEditDemographics = this.auth.getConfiguration("enable-edit-demographic-for-mel").enabled;

    this.http.getclientResource(this.clientId, null, null, true).subscribe(data => {
      this.client = data;
      this.client.age = this.form.calculateAge(this.client.dateOfBirth)
      this.enableEditDemographic = !(this.client.status.value == 'Closed' || this.client.status.value == 'Closed As Death');

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
      this.clientAccounts = data;
      if (data.savingsAccounts && data.savingsAccounts.length) {
        this.updateDefaultSavings = data.savingsAccounts.some(e => {
          return e.status.value === "Active"
        })
      }

      if (data.loanAccounts && data.loanAccounts.length) {
        data.loanAccounts.forEach(e => {
          if (this.isLoanClosed(e, false)) {
            this.activeLoanAccounts.push(e)
          } else {
            this.closedLoanAccounts.push(e)
          }
        });
      }
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

    let configForDemographics = this.auth.getConfiguration("restricted_stage_edit_demographic");
    let editDemographicRestrictedStage = configForDemographics.value.split(",");

    if (configForDemographics.enabled) {
      this.http.loanAppRefStatusResource(this.clientId).subscribe(data => {
        this.enableEditDemographic = data.some(e => {
          return !(editDemographicRestrictedStage.includes(e.status.code))
        })
      })
    }

    let enableMelEditDemographics = this.auth.getConfiguration("enable-edit-demographic-for-mel").enabled;

    this.http.getProcessResource(null, null, this.clientId).subscribe(data => {
      
      if (data && data.length) {
        data.forEach( e=> {
          if (e.processName == "MEL Unsecured") {
            this.showClientDemographicForMel = enableMelEditDemographics;
          }
          if (e.processName == "MEL Unsecured" || e.processName == "JLGRegular" || e.processName == "JLGSeasonal" || e.processName == "JLGBC" ||
            e.processName == "Suvidha Shakti" || e.processName == 'JLGBCRevised') {
              this.associatedWorkflows.push(e);
              if (e.loanAccountNumber) {
                this.showLoanAccountNumberHeader = true;
            }
          }
        })
      }
      this.enableEditDemographic = data.some(e => {
        return !(editDemographicRestrictedStage.includes(e.activityName))
      })
    });

    this.http.getloanDisbursementPhaseResource(this.clientId).subscribe(data => {
      this.editDemoPermission = data.isPrePhase ? 'CREATECLIENT_EDITDEMOGRAPHIC_PRE_SANCTION' : 'CREATECLIENT_EDITDEMOGRAPHIC_POST_DISBURSEMENT';
    });

    this.http.demoAuthConfigDetailResource(this.auth.userData.officeId).subscribe(data => {
      this.showDemoAuthButton = data.isDemoAuthEnabledState && data.isDemoAuthGlobleConfigEnable ? true : false;
    })

    this.http.checkerInboxResource(null, 'CLOSEDASDEATH', 'CLIENT', this.clientId).subscribe(data => {
      this.deathRequestPending = data.length > 0 ? true : false;
    })

    if (this.isBC) {
      let daysConfiguration = parseInt(this.auth.getConfiguration('bc-death-tagging-edit-days').value);
      let daysConfigurationEnabled = this.auth.getConfiguration('bc-death-tagging-edit-days').enabled;

      this.http.clientApiResource(this.clientId).subscribe(data => {

        let today = new Date();
        today = new Date(today.setHours(0, 0, 0, 0));
        let deathTaggedOnDateApplicant = new Date(data.deathTaggedOnDateApplicant);
        let deathTaggedOnDateCoApplicant = new Date(data.deathTaggedOnDateCoApplicant);

        let endDateForEditingDeathTaggingofApplicant = new Date(deathTaggedOnDateApplicant.setDate(deathTaggedOnDateApplicant.getDate() + daysConfiguration));

        let endDateForEditingDeathTaggingofCoApplicant = new Date(deathTaggedOnDateCoApplicant.setDate(deathTaggedOnDateCoApplicant.getDate() + daysConfiguration));

        data.context.forEach(e => {

          let bcDeathTaggingData = JSON.parse(e);
          let applicantdetails = bcDeathTaggingData.formData.applicant;
          let coapplicantdetails = bcDeathTaggingData.formData.coapplicant;

          if (applicantdetails && applicantdetails.deathCertificateVerified == "no" && ((endDateForEditingDeathTaggingofApplicant >= today && daysConfigurationEnabled) || !daysConfigurationEnabled)) {
            this.allowEditingOfDeathDate = data.isEditPerformedApplicant ? this.allowEditingOfDeathDate : true;
          }

          if (coapplicantdetails && coapplicantdetails.deathCertificateVerified == "no" && ((endDateForEditingDeathTaggingofCoApplicant >= today && daysConfigurationEnabled) || !daysConfigurationEnabled)) {
            this.allowEditingOfDeathDate = data.isEditPerformedCoApplicant ? this.allowEditingOfDeathDate : true;
          }
        })
      });
    }

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