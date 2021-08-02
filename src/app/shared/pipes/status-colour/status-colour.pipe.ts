import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'StatusLookup'
})
export class StatusColourPipe implements PipeTransform {

  transform(value: string): string {
    let cssClassNameLookup = {
      "true": "statusactive",
      "false": "statusdeleted",
      "Active": "statusactive",
      "loanStatusType.submitted.and.pending.approval": "loanstatuspending",
      "loanStatusType.approved": "loanstatusApproved",
      "loanStatusType.active": "loanstatusactive",
      "loanStatusType.overpaid": "loanstatusoverpaid",
      "loanStatusType.freezedAccount": "loanstatusfreezedAccount",
      "loanStatusType.death.foreclosure": "loanstatusdeathforeclosedAccount",
      "loanStatusType.foreclosureFreeze": "loanstatusfreezedAccount",
      "loanStatusType.deathOfApplicant": "loanstatuscloseasdeath",
      "loanStatusType.death.foreclosureFreeze": "loanstatusdeathfreezedAccount",
      "loanStatusType.deathOfCoApplicant": "loanstatusdeathOfCoApplicant",
      "loanStatusType.death.coApplicant.foreclosureFreeze": "loanstatusdeathcoApplicantforeclosureFreeze",
      "loanStatusType.death.coApplicant.foreclosure": "loanstatusdeathcoApplicantforeclosure",
      "savingsAccountStatusType.submitted.and.pending.approval": "statuspending",
      "savingsAccountStatusType.approved": "statusApproved",
      "savingsAccountStatusType.active": "statusactive",
      "savingsAccountStatusType.matured": "statusmatured",
      "loanProduct.active": "statusactive",
      "clientStatusType.pending": "statuspending",
      "clientStatusType.active": "statusactive",
      "clientStatusType.submitted.and.pending.approval": "statuspending",
      "clientStatusTYpe.approved": "statusApproved",
      "clientStatusType.transfer.in.progress": "statustransferprogress",
      "clientStatusType.transfer.on.hold": "statustransferonhold",
      "clientStatusType.closedAsDeath": "statuscloseasdeath",
      "groupingStatusType.active": "statusactive",
      "groupingStatusType.pending": "statuspending",
      "groupingStatusType.submitted.and.pending.approval": "statuspending",
      "groupingStatusType.approved": "statusApproved"
    }
    return cssClassNameLookup[value];
  }

}
