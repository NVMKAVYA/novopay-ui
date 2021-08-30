import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constants } from 'src/app/models/Constants';
import { ClientStatus } from 'src/app/models/clientStatus';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormService } from 'src/app/services/form/form.service';
import { forkJoin } from 'rxjs';
import { SimpleModalService } from 'ngx-simple-modal';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ViewDocumentsComponent } from 'src/app/shared/components/view-documents/view-documents/view-documents.component'

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
  associatedloanapplications: any = [];
  showLoanAccountNumberHeader: boolean = false;
  identitydocuments: any;
  clientNotes: any;
  createNoteText: string;
  errorMessage: string;
  gst: any = {};
  clientDocuments: any;
  stateOptions: any[] = [];
  // activateDocumentsTab: boolean = false;

  constructor(private http: HttpService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private auth: AuthService, private form: FormService, private modal: SimpleModalService) { }

  @ViewChild(ViewDocumentsComponent) child: ViewDocumentsComponent;

  ngOnInit(): void {

    this.clientId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.enableMelEditDemographics = this.auth.getConfiguration("enable-edit-demographic-for-mel").enabled;

    this.http.getclientResource(this.clientId, null, null, true).subscribe(data => {
      this.client = data;
      this.client.age = this.form.calculateAge(this.client.dateOfBirth)
      this.enableEditDemographic = !(this.client.status.value == 'Closed' || this.client.status.value == 'Closed As Death');

      if (this.client.imagePresent) {
        this.getClientImage();
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
        data.forEach(e => {
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

    this.http.nonWorkflowLoanAccounts(null, this.clientId).subscribe(data => {
      if (data && data.length > 0) {
        data.forEach(e => {
          this.associatedloanapplications.push(e);
        })
      }
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

    if (this.auth.isBC) {
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

  getClientImage() {
    this.http.getClientImage(this.clientId, 'maxHeight=300').subscribe(data => {
      this.clientImage = this.sanitizer.bypassSecurityTrustResourceUrl(data);
    })
  }

  setTab(tab: number) {
    this.tab = tab;
  }

  isLoanClosed(account, close) {
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

  isPrimaryLoan(id) {
    if (this.primaryLoanProducts.indexOf(id) > -1) {
      return true;
    }
  };

  showModal(entityId, ...type) {
    this.modal.addModal(UploadModalComponent, {
      type: type,
      entityId: entityId
    }).subscribe((data) => {
      if (data) {
        switch (type[0]) {
          case 'Client Image': this.getClientImage();
            break;
          case 'Client Signature': this.clientDocuments = null;
            if (this.tab == 6) {
              setTimeout(() => {
                this.child.getDocuments();
              }, 100);
            }
            break;
          case 'Client Document': this.identitydocuments = null;
            this.getClientIdentityDocuments();
            break;
        }
      }
    });
  }

  getGSTDetails() {
    if (!Object.keys(this.gst).length) {
      forkJoin([this.http.getGSTResource('GSTNumberData', 'CLIENT', this.clientId), this.http.getGSTResource('GSTExemptionData', 'CLIENT', this.clientId),
      this.http.getGSTResource('ClientBankRelationData', 'CLIENT', this.clientId)]).subscribe((data: any) => {
        this.gst.isGSTNRegistered = data[0][0]?.isGSTNRegistered;
        this.gst.clientGSTN = data[0];
        this.gst.isExemptionActive = data[1]?.isExemptionActive || false;
        this.gst.isRelatedParty = data[2]?.isRelatedParty || false;
        if (this.gst.isGSTNRegistered) {
          this.http.getstateDetailResource().subscribe(data => {
            this.stateOptions = data;
          })
        }
        if (this.gst.isExemptionActive) {
          this.gst.exemptionStartDate = data[1]?.exemptionStartDate;
          this.gst.exemptionEndDate = data[1]?.exemptionEndDate;
        }
        if (this.gst.isRelatedParty) {
          this.gst.relationStartDate = data[2]?.relationStartDate;
          this.gst.relationEndDate = data[2]?.relationEndDate;
        }
      })
    }
  }

  getAddresses() {
    if (!this.addresses.length) {
      this.http.addressResource('clients', this.clientId).subscribe(data => {
        this.addresses = data;
      })
    }
  };

  getClientIdentityDocuments() {
    if (!this.identitydocuments) {
      this.http.getclientResource(this.clientId, 'identifiers').subscribe(data => {
        this.identitydocuments = data;
        data.forEach(e => {
          this.http.clientIdentifierResource(e.id).subscribe(data => {
            e.documents = data;
          });
        })
      })
    }
  };

  getDocumentsData(data) {
    this.clientDocuments = data;
  }

  getNotes() {
    if (!this.clientNotes) {
      this.http.getclientNotesResource(this.clientId).subscribe(data => {
        this.clientNotes = data;
      })
    }
  }

  createNote() {
    if (this.createNoteText) {
      let data = { note: this.createNoteText };
      this.http.saveClientResource(this.clientId, 'notes', data).subscribe(data => {
        let currentNote = {
          id: data.resourceId,
          note: this.createNoteText,
          createdByUsername: this.auth.userData.username,
          createdOn: new Date()
        };
        this.clientNotes.push(currentNote);
        this.createNoteText = null;
      });
    }
  }

  editNote(note) {
    note.showEdit = true;
    note.newNote = note.note;
  }

  saveEditedNote(note) {
    this.errorMessage = "";
    if (note.note != note.newNote) {
      let data = { note: note.newNote };
      this.http.updateClientResource(this.clientId, 'notes', data, note.id).subscribe(data => {
        this.clientNotes = null;
        this.getNotes();
      });
    } else {
      this.errorMessage = 'No changes done to save'
    }
  }

}