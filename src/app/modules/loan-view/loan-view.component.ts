import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/models/Constants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-loan-view',
  templateUrl: './loan-view.component.html',
  styleUrls: ['./loan-view.component.css']
})

export class LoanViewComponent implements OnInit {
  loanId: number;
  loanDetails: any;
  loanAppRefData: any;
  rsdTransactions: any;
  rsdAccountData: any = [];
  dateFormat: any = Constants.dateFormat1;
  showChargeTable: boolean = false;
  status: string;
  buttons: any = {
    options: [],
    singlebuttons: []
  };;
  isRepaymentDone: boolean = false;
  showGenerateNocButton: boolean = false;
  showCaptureAccountGstExemption: boolean = true;
  hideButtonOptions: boolean = false;
  rescheduledByMoratorium: any = false;
  closedOrObligationMetStatusIdList = [600, 602, 611, 612, 806];
  isOverpaidExists: boolean = false;
  tab: number = 1;
  guarantorDetails: any = [];
  guarantorDetailsTab: any = [];
  hideAccruals: boolean = true;
  viewbuttons: boolean = false;
  loanDocuments: any;
  loandatatables: any;
  loanapprefdatatables: any;
  datatabledetails: any;
  singleRow: any[] = [];
  religion: number;
  siApplicable: boolean = false;
  repaymentModeForm: FormGroup;
  modeOfRepaymentTypes: any;
  defaultRepaymentMode: any;
  hideTableArray = ['d_client_aadhaar_details', 'd_construction_details', 'd_cpv_business', 'd_cpv_detail', 'd_cpv_income', 'd_cpv_neighbour_reference_check', 'd_cpv_reference_checks',
    'd_cpv_residential', 'd_cpv_residential_assets', 'd_cpv_trc_neighbour_reference_check',
    'd_cpv_trc_other_reference_check', 'd_customer_reference_check', 'd_deviation_rules_history',
    'd_ekyc_application_details', 'd_family', 'd_family_member', 'd_income_details', 'd_mel_cpv_office',
    'd_personal_reference_check', 'd_si_details', 'd_si_history', 'd_supplier_reference_check',
    'd_visiting_officer_check'
  ];
  endusechecks: any;
  documentId: any;
  endUseCheckExtData: any = [];
  transactionSort = {
    column: 'date',
    descending: true
  };

  constructor(private http: HttpService, private route: ActivatedRoute, private datePipe: DatePipe, private auth: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loanId = parseInt(this.route.snapshot.paramMap.get('id'));
    let overpaidEnabled = this.auth.getConfiguration("enable-overpaid-closure").enabled

    this.http.LoanAccountResource(this.loanId, 'all').subscribe(response => {
      this.loanDetails = response;
      this.status = this.loanDetails.status.value;

      if (this.closedOrObligationMetStatusIdList.indexOf(this.loanDetails.status.id) > -1 && (this.auth.userData.roles[0].name == 'Transaction Officer' || this.auth.userData.roles[0].name == 'Field Manager' || this.auth.userData.roles[0].name == 'Account Manager')) {
        this.showGenerateNocButton = true;
      }

      if (this.loanDetails.loanApplicationReferenceId) {
        this.http.loanAppRefResource(this.loanDetails.loanApplicationReferenceId).subscribe(loanAppRefData => {
          this.loanAppRefData = loanAppRefData;
          if (loanAppRefData.coApplicant1Id) {
            // Calling this API just for Lead is unnecessary- need to discuss
            this.http.getclientResource(loanAppRefData.coApplicant1Id).subscribe(data => {
              this.loanAppRefData.coapplicantLeadid = data.leadId;
            });
          }
          this.repaymentModeForm = this.fb.group({});
        });
        this.http.getRSDAccountResource(this.loanDetails.loanApplicationReferenceId).subscribe(response => {
          this.rsdAccountData = response;
        })
      }

      if (this.loanDetails.summary && (this.loanDetails.summary.totalRepayment -
        (this.loanDetails.summary.feeChargesPaid + this.loanDetails.summary.insuranceFeePaid) != 0)) {
        this.isRepaymentDone = true;
      } else {
        this.isRepaymentDone = false;
      }

      this.isOverpaidExists = overpaidEnabled && this.loanDetails.totalOverpaid > 0 && this.loanDetails.summary.totalOutstanding == 0 ? true : false;

      if (this.loanDetails.charges) {
        this.loanDetails.charges.forEach(charge => {
          charge.actionFlag = (charge.paid || charge.waived || charge.chargeTimeType.value == 'Disbursement' || this.loanDetails.status.value != 'Active') ? true : false;
        })
        this.showChargeTable = true;
      }

      switch (true) {

        case (this.status == "Rejected" || this.status == "Cancel Sanction Pending" || this.status == "Cancel Sanction"):
          // this.editSPDC = false
          break;
        case (this.status == "Submitted and pending approval"):
          this.viewbuttons = true;
          this.buttons.options = [{
            name: "Assign Loan Officer",
            taskPermissionName: 'UPDATELOANOFFICER_LOAN'
          },
          {
            name: "Withdrawn by client",
            taskPermissionName: 'WITHDRAW_LOAN'
          },
          {
            name: "Delete",
            taskPermissionName: 'DELETE_LOAN'
          },
          {
            name: "Add Collateral",
            taskPermissionName: 'CREATE_COLLATERAL'
          },
          {
            name: "Guarantor",
            taskPermissionName: 'CREATE_GUARANTOR'
          },
          {
            name: "Loan Screen Reports",
            taskPermissionName: 'READ_LOAN'
          }
          ]
          if (!this.loanDetails.isWorkflowOriginated) {
            this.buttons.singlebuttons = [{
              name: "Add Loan Charge",
              icon: "fa fa-plus-circle",
              taskPermissionName: 'CREATE_LOANCHARGE'
            }, {
              name: "Approve",
              icon: "fa fa-check",
              taskPermissionName: 'APPROVE_LOAN'
            }, {
              name: "Modify Application",
              icon: "fa fa-edit",
              taskPermissionName: 'UPDATE_LOAN'
            }, {
              name: "Reject",
              icon: "fa fa-remove",
              taskPermissionName: 'REJECT_LOAN'
            }]
          };
          break;
        case (this.status == "Approved"):
          this.viewbuttons = true;
          // this.editSPDC = false
          this.buttons.singlebuttons = [
            {
              name: "Assign Loan Officer",
              icon: "fa fa-user",
              taskPermissionName: 'UPDATELOANOFFICER_LOAN'
            },
            {
              name: "Undo Approval",
              icon: "fa fa-undo",
              taskPermissionName: 'APPROVALUNDO_LOAN'
            }
          ],
            this.buttons.options = [{
              name: "Add Loan Charge",
              taskPermissionName: 'CREATE_LOANCHARGE'
            },
            {
              name: "Guarantor",
              taskPermissionName: 'CREATE_GUARANTOR'
            }
            ]
          if (!this.loanDetails.isWorkflowOriginated) {
            this.buttons.singlebuttons.push({
              name: "Disburse",
              icon: "fa fa-flag",
              taskPermissionName: 'DISBURSE_LOAN'
            })
          };
          break;
        case (this.status == "Active"):
          // this.choice = true;
          this.buttons.singlebuttons = [
            {
              name: "Make Part Prepayment",
              icon: "fa fa-dollar",
              taskPermissionName: 'PART_PREPAYMENT_LOAN'
            },
            {
              name: "Perform moratorium",
              icon: "fa fa-dollar",
              taskPermissionName: 'MORATORIUM_LOAN'
            },
            {
              name: "Perform Schedule Correction",
              icon: "fa fa-dollar",
              taskPermissionName: 'SCHEDULE_CORRECTION_LOAN'
            },
            {
              name: "Perform Morat Correction",
              icon: "fa fa-dollar",
              taskPermissionName: 'MORATORIUM_LOAN'
            },
            {
              name: "Add Loan Charge",
              icon: "fa fa-plus-circle",
              taskPermissionName: 'CREATE_LOANCHARGE'
            },
            {
              name: "Make Repayment",
              icon: "fa fa-dollar",
              taskPermissionName: 'REPAYMENT_LOAN'
            },
            {
              name: "Undo Disbursal",
              icon: "fa fa-undo",
              taskPermissionName: 'DISBURSALUNDO_LOAN'
            }
          ];
          this.buttons.options = [
            {
              name: "Write-Off",
              taskPermissionName: 'WRITEOFF_LOAN'
            },
            {
              name: "Close (as Rescheduled)",
              taskPermissionName: 'CLOSEASRESCHEDULED_LOAN'
            }
          ]
          if (this.loanDetails.canDisburse && !this.loanDetails.isWorkflowOriginated) {
            this.buttons.singlebuttons.push({
              name: "Disburse",
              icon: "fa fa-flag",
              taskPermissionName: 'DISBURSE_LOAN'
            });
            this.buttons.singlebuttons.push({
              name: "Disburse To Savings",
              icon: "fa fa-flag",
              taskPermissionName: 'DISBURSETOSAVINGS_LOAN'
            });
          }
          if (!this.loanDetails.loanOfficerName) {
            this.buttons.singlebuttons.push({
              name: "Assign Loan Officer",
              icon: "fa fa-user",
              taskPermissionName: 'UPDATELOANOFFICER_LOAN'
            });
          }
          if (!this.loanDetails.isDisbursementCancellationReversalInProgress && this.isEligibleForLoanCancellation()) {
            this.buttons.options.push({
              name: "Disbursement Cancellation",
              taskPermissionName: 'DISBURSE_LOAN'
            });
            if (this.isEligibleForDisbursementReversal()) {
              this.buttons.options.push({
                name: "Disbursement Reversal",
                taskPermissionName: 'DISBURSE_LOAN'
              });
            }
          }
          break;
        case (this.status == "Closed (written off)"):
          this.buttons = {
            singlebuttons: [{
              name: "Recovery Repayment",
              icon: "fa fa-briefcase",
              taskPermissionName: 'RECOVERYPAYMENT_LOAN'
            }]
          };
          break;
        case (this.status == "Freezed for Foreclosure"):
          this.showCaptureAccountGstExemption = false;
          this.hideButtonOptions = true;
          this.buttons = {
            singlebuttons: [],
            options: []
          };
          break;

      }

      this.http.loanProductResource(this.loanDetails.loanProductId).subscribe(response => {
        this.siApplicable = response.siApplicable;
        if (!response.isPartPaymentEnabled) {
          let index = this.buttons.singlebuttons.findIndex(button => button.taskPermissionName === "PART_PREPAYMENT_LOAN");
          this.buttons.singlebuttons.splice(index, 1);
        }
      });
    });

    this.http.getStatusOfMoratorium(this.loanId).subscribe(response => {
      this.rescheduledByMoratorium = Object.values(response);
      this.rescheduledByMoratorium.splice(this.rescheduledByMoratorium.length - 2, 2);
      this.rescheduledByMoratorium = this.rescheduledByMoratorium.join("")
    });

    this.http.getRSDTransactionResource(this.loanId).subscribe(response => {
      this.rsdTransactions = response;
    });

    this.http.dataTablesResource('m_loan').subscribe(response => {
      for (let i = 0; i < response.length; i++) {
        response[i].tableName = response[i]?.registeredTableName.replace('d_', '').split('_').join(' ');
      }
      this.loandatatables = response;
    })

    this.http.dataTablesResource('m_loan_app_reference').subscribe(response => {
      for (let i = 0; i < response.length; i++) {
        if (response[i].registeredTableName == 'd_eligibility_rules') {
          response.splice(i, 1);
          // some code missing
        }
        for (let j = 0; j < this.hideTableArray.length; j++) {
          if (this.hideTableArray[j] == response[i].registeredTableName) {
            response.splice(i, 1);
          }
        }
        if (response[i])
          response[i].tableName = response[i]?.registeredTableName.replace('d_', '').split('_').join(' ');
      }
      this.loanapprefdatatables = response;
    })

  }

  isEligibleForLoanCancellation() {
    if (this.loanDetails.timeline.actualDisbursementDate) {
      let dateWithoutTime = new Date(new Date().setHours(0, 0, 0, 0));
      let disbursementDate = new Date(this.loanDetails.timeline.actualDisbursementDate[0], this.loanDetails.timeline.actualDisbursementDate[1] - 1, this.loanDetails.timeline.actualDisbursementDate[2]);
      let lastDayOfMonthLoanDisbursed = new Date(disbursementDate.getFullYear(), disbursementDate.getMonth() + 1, 0);
      let firstRepaymentDueDate = new Date(this.datePipe.transform(this.loanDetails.expectedFirstRepaymentOnDate || this.loanDetails.repaymentSchedule.periods[1].dueDate));
      if (this.loanDetails.summary.interestPaid === 0 && this.loanDetails.summary.principalPaid === 0 && this.loanDetails.summary.totalAdvancePaid === 0) {
        if ((firstRepaymentDueDate <= lastDayOfMonthLoanDisbursed && dateWithoutTime <= firstRepaymentDueDate) || (firstRepaymentDueDate > dateWithoutTime && dateWithoutTime <= lastDayOfMonthLoanDisbursed)) {
          return true;
        }
      }
    }
    return false;
  };

  isEligibleForDisbursementReversal() {
    let today = new Date(new Date().setHours(0, 0, 0, 0));
    let disbursementDate = new Date(this.loanDetails.timeline.actualDisbursementDate[0], this.loanDetails.timeline.actualDisbursementDate[1] - 1, this.loanDetails.timeline.actualDisbursementDate[2]);
    return disbursementDate.getTime() == today.getTime();
  };

  isRepaid(buttonName) {
    return buttonName == "Undo Disbursal" && this.isRepaymentDone == true ? true : false;
  };

  undoDisbursalCheck = function (buttonName) {
    if (buttonName == "Undo Disbursal" && this.loanDetails.expectedFirstRepaymentOnDate) {
      let expectedFirstRepaymentOnDate = new Date(this.loanDetails.expectedFirstRepaymentOnDate[0], this.loanDetails.expectedFirstRepaymentOnDate[1] - 1, this.loanDetails.expectedFirstRepaymentOnDate[2]);
      return expectedFirstRepaymentOnDate <= new Date() || this.loanDetails.summary.totalAdvancePaid > 0 ? true : false;
    }
    return false;
  };

  setTab(tab: number) {
    this.tab = tab;
  }

  showGurantorDetails(guarantorId, index) {
    if (!this.guarantorDetailsTab[index]) {
      if (!this.guarantorDetails[index]) {
        this.http.guarantorResource(this.loanId, guarantorId).subscribe(data => {
          this.guarantorDetails[index] = data;
          this.guarantorDetailsTab[index] = true;
        });
      } else {
        this.guarantorDetailsTab[index] = true;
      }
    } else {
      this.guarantorDetailsTab[index] = false;
    }
  };

  changeTransactionSort = function (column) {
    if (this.transactionSort.column == column) {
      this.transactionSort.descending = !this.transactionSort.descending;
    } else {
      this.transactionSort.column = column;
      this.transactionSort.descending = true;
    }
  };

  hideAccrualsTransaction(transaction) {
    if ((transaction.type.accrual || transaction.type.accrualSuspense || transaction.type.accrualWrittenOff || transaction.type.accrualSuspenseReverse || transaction.type.accrualReverse) &&
      this.hideAccruals) {
      return false;
    }
    return true;
  }

  getDocumentsData(data) {
    this.loanDocuments = data;
  }

  dataTableChange(datatable) {
    if (datatable.registeredTableName != 'd_fatca') {
      this.http.dataTablesResource(null, datatable.registeredTableName, this.loanDetails.loanApplicationReferenceId, 'true').subscribe(data => {
        this.datatabledetails = data;
        if (datatable.registeredTableName === 'd_personal_details') {
          this.datatabledetails.data.forEach((data) => {
            if (!data.row[6]) {
              if (!this.religion) {
                this.http.religionIdForLoanResource(this.loanId).subscribe(response => {
                  this.religion = response.ReligionCvId;
                  data.row[6] = response.ReligionCvId;
                })
              } else {
                data.row[6] = this.religion;
              }
            }
          });
        }
        if (this.datatabledetails.data.length) {
          this.datatabledetails.columnHeaders.forEach((header, i) => {
            if (!(this.datatabledetails.columnHeaders[0].columnName == "id")) {
              let row: any;
              row.key = header.columnName;
              row.value = data.data[0].row[i];
              this.singleRow.push(row);
            }
          })
        }
      });
    } else {
      this.http.readDataTableByType('fatca', this.loanDetails.loanApplicationReferenceId, this.loanDetails.clientId).subscribe(response => {
        this.datatabledetails = {};
        this.datatabledetails.columnHeaders = [
          { "columnName": "id" }, { "columnName": "loan_app_reference_id" },
          { "columnName": "client_id" }, { "columnName": "country_of_birth" }, { "columnName": "country_of_tax_residence" },
          { "columnName": "place_of_birth" }, { "columnName": "foreign_tax_id" }, { "columnName": "TIN_issuing_country" }
        ];
        let row = [response.id, response.loanApplicationReferenceId, this.loanDetails.clientId, response.countryOfBirth.id ? response.countryOfBirth.name : null, response.countryOfTaxResidence.id ? response.countryOfTaxResidence.name : null, response.placeOfBirth ? response.placeOfBirth : null, response.foreignTaxID ? response.foreignTaxID : null, response.tinIssuingCountry.id ? response.tinIssuingCountry.name : null
        ];
        this.datatabledetails.data[0] = { "row": row };
      })
    }
  };

  getEndUseChecks() {
    this.http.LoanEndUseCheckResource(this.loanId).subscribe(data => {
      this.endusechecks = data;
      this.endusechecks.forEach(e => {
        e.viewImage = e == 0 ? true : false;
        if (e.eucExtData) {
          var endUseCheckExtDataArr = e.eucExtData;
          this.endUseCheckExtData = endUseCheckExtDataArr[endUseCheckExtDataArr.length - 1];
          if (this.endUseCheckExtData && this.endUseCheckExtData.documentId) {
            this.documentId = this.endUseCheckExtData.documentId
          }
        }
      })
    });
  };

  getRepaymentModes() {
    this.http.codeValuesResource('RepaymentMode', this.loanDetails.processDefKey).subscribe(response => {
      this.modeOfRepaymentTypes = response;
      this.defaultRepaymentMode = this.modeOfRepaymentTypes.find(type => {
        type.name == "Cash";
      });
      // if (this.loanAppRefData.repaymentTypeId) {
      //   scope.formData.repaymentDetails.repaymentTypeId = scope.loanAppRefData.repaymentTypeId;
      // if (scope.formData.repaymentDetails.repaymentTypeId == scope.defaultRepaymentMode.id) {
      //   scope.isNonCashRepaymentMode = false;
      // } else {
      //   scope.isNonCashRepaymentMode = true;
      // }
      // scope.loadSIData(scope.loandetails.loanApplicationReferenceId);
      // if (scope.defaultRepaymentMode.id != scope.formData.repaymentDetails.repaymentTypeId) {
      //   scope.repaymentModeFromAppRef = true;
      // }
      // } else {
      //   scope.formData.repaymentDetails.repaymentTypeId = scope.defaultRepaymentMode.id;
      // }
    })
  }
}
