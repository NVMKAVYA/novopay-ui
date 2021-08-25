import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/models/Constants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  transactionSort = {
    column: 'date',
    descending: true
  };

  constructor(private http: HttpService, private route: ActivatedRoute, private datePipe: DatePipe, private auth: AuthService) { }

  ngOnInit(): void {
    this.loanId = parseInt(this.route.snapshot.paramMap.get('id'));
    let overpaidEnabled = this.auth.getConfiguration("enable-overpaid-closure").enabled

    this.http.LoanAccountResource(this.loanId, 'all').subscribe(response => {
      this.loanDetails = response;
      this.status = this.loanDetails.status.value;

      if (this.closedOrObligationMetStatusIdList.indexOf(this.loanDetails.status.id) > -1 && (this.auth.userData.userRole.name == 'Transaction Officer' || this.auth.userData.userRole.name == 'Field Manager' || this.auth.userData.userRole.name == 'Account Manager')) {
        this.showGenerateNocButton = true;
      }

      if (this.loanDetails.loanApplicationReferenceId) {
        this.http.loanAppRefResource(this.loanDetails.loanApplicationReferenceId).subscribe(loanAppRefData => {
          this.loanAppRefData = loanAppRefData;
          // resourceFactory.processesResource.getAllProcesses({
          //   variableName: "applicationRefId",
          //   variableValue: scope.loandetails.loanApplicationReferenceId
          // }, function (data) {
          //   scope.associatedWorkflows = data;
          //   scope.associatedWorkflow = scope.associatedWorkflows[0];
          //   $rootScope.currentProcessId = scope.associatedWorkflow.instanceId;
          // });

          if (loanAppRefData.coApplicant1Id) {
            // Calling this API just for Lead is unnecessary- need to discuss
            this.http.getclientResource(loanAppRefData.coApplicant1Id).subscribe(data => {
              this.loanAppRefData.coapplicantLeadid = data.leadId;
            });
          }
          // resourceFactory.RSDAccountResource.get({ loanAppRefId: scope.loandetails.loanApplicationReferenceId }, function (rsdAccountData) {
          //   scope.rsdAccountData = rsdAccountData;
          // });

          // if (scope.siApplicable) {
          //   scope.installmentAmount = scope.loandetails.repaymentSchedule.periods[1].interestDue + scope.loandetails.repaymentSchedule.periods[1].principalDue;
          //   scope.formData.siDetails.max_amount = scope.loandetails.approvedPrincipal;
          //   scope.loanType = scope.loandetails.loanProductName;

          //   var periods = scope.loandetails.repaymentSchedule.periods;
          //   var endDate = new Date(periods[periods.length - 1].dueDate);
          //   scope.end_date = dateFilter(new Date(endDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate(), 0, 0, 0), "dd/MM/yyyy");
          //   scope.endDateOptions = ["Until Cancelled", scope.end_date.toString()];

          //   resourceFactory.codeCodeValuesResources.getAllCodesValues({ codeName: 'AccountType', context: scope.loandetails.processDefKey }, function (bankAccountCodeValues) {
          //     scope.bankAccountTypes = _.filter(bankAccountCodeValues, function (accountType) {
          //       return accountType.context.indexOf("repaymentAccountType") > -1;
          //     });
          //   });

          //   resourceFactory.codeCodeValuesResources.getAllCodesValues({ codeName: 'SIHoldReason' }, function (codeValues) {
          //     scope.siHoldReasonDropDown = codeValues;
          //   });

          //   resourceFactory.taskRoleConfigResource.getAll(function (data) {
          //     scope.allTasksData = data;
          //     for (var i = 0; i < scope.allTasksData.length; i++) {
          //       if (!scope.allTasksData[i].isWorkflowAvailable && scope.allTasksData[i].taskTypeName == "Standing Instruction") {
          //         if (scope.allTasksData[i].subTaskTypeName == "Approve Standing Instruction") {
          //           for (var j = 0; j < scope.allTasksData[i].taskRoleMapList[0].roles.length; j++)
          //             scope.siApprovalRole.push(scope.allTasksData[i].taskRoleMapList[0].roles[j].name);
          //         }
          //       }
          //     }
          //   });

          //   resourceFactory.codeCodeValuesResources.getAllCodesValues({ codeName: 'RepaymentMode', context: scope.loandetails.processDefKey }, function (repaymentModeDropDown) {
          //     scope.modeOfRepaymentTypes = repaymentModeDropDown;
          //     scope.defaultRepaymentMode = _.find(scope.modeOfRepaymentTypes, function (codevalue) { return codevalue.name == "Cash"; });
          //     if (scope.loanAppRefData.repaymentTypeId) {
          //       scope.formData.repaymentDetails.repaymentTypeId = scope.loanAppRefData.repaymentTypeId;
          //       if (scope.formData.repaymentDetails.repaymentTypeId == scope.defaultRepaymentMode.id) {
          //         scope.isNonCashRepaymentMode = false;
          //       } else {
          //         scope.isNonCashRepaymentMode = true;
          //       }
          //       scope.loadSIData(scope.loandetails.loanApplicationReferenceId);
          //       if (scope.defaultRepaymentMode.id != scope.formData.repaymentDetails.repaymentTypeId) {
          //         scope.repaymentModeFromAppRef = true;
          //       }
          //     } else {
          //       scope.formData.repaymentDetails.repaymentTypeId = scope.defaultRepaymentMode.id;
          //     }
          //   });
          // }

          // resourceFactory.codeCodeValuesResources.getAllCodesValues({ codeName: 'SpdcStatusTypes', context: 'MELUnsecured' }, function (spdcTypeDropDowns) {
          //   scope.spdcStatusDropDownTypes = spdcTypeDropDowns;
          //   scope.spdcDataForReset = angular.copy(scope.loandetails.loanSpdcDatas);
          //   for (var count = 0; count < scope.loandetails.loanSpdcDatas.length; count++) {
          //     if (scope.loandetails.loanSpdcDatas[count].spdcChequeSrNumber == "" || scope.loandetails.loanSpdcDatas[count].spdcChequeSrNumber == undefined) {
          //       scope.showSpdcTab = false;
          //     }
          //     console.log('scope.loandetails.loanSpdcDatas[count]', scope.loandetails.loanSpdcDatas[count]);
          //     for (var innerCount = 0; innerCount < scope.spdcStatusDropDownTypes.length; innerCount++) {
          //       if (scope.spdcStatusDropDownTypes[innerCount].id == scope.loandetails.loanSpdcDatas[count].spdcStatus &&
          //         scope.spdcStatusDropDownTypes[innerCount].name == 'OUT') {
          //         scope.loandetails.loanSpdcDatas[count].disabled = true;
          //         break;
          //       }
          //     }
          //     if (!scope.loandetails.loanSpdcDatas[count].hasOwnProperty('disabled')) {
          //       scope.loandetails.loanSpdcDatas[count].disabled = false;
          //     }
          //   }
          // });
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
          // this.choice = true;
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
          // this.choice = true;
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
              name: "button.moratorium",
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
    });

    this.http.getStatusOfMoratorium(this.loanId).subscribe(response => {
      this.rescheduledByMoratorium = Object.values(response);
      this.rescheduledByMoratorium.splice(this.rescheduledByMoratorium.length - 2, 2);
      this.rescheduledByMoratorium = this.rescheduledByMoratorium.join("")
    });

    this.http.getRSDTransactionResource(this.loanId).subscribe(response => {
      this.rsdTransactions = response;
    });

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
}
