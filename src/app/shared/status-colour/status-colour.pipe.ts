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
      "loanStatusType.submitted.and.pending.approval": "statuspending",
      "loanStatusType.approved": "statusApproved",
      "loanStatusType.active": "statusactive",
      "loanStatusType.overpaid": "statusoverpaid",
      "loanStatusType.freezedAccount": "statusfreezedAccount",
      "loanStatusType.death.foreclosure": "statusdeathforeclosedAccount",
      "loanStatusType.foreclosureFreeze": "statusfreezedAccount",
      "loanStatusType.deathOfApplicant": "statuscloseasdeath",
      "loanStatusType.death.foreclosureFreeze": "statusdeathfreezedAccount",
      "loanStatusType.deathOfCoApplicant": "statusdeathOfCoApplicant",
      "loanStatusType.death.coApplicant.foreclosureFreeze": "statusdeathcoApplicantforeclosureFreeze",
      "loanStatusType.death.coApplicant.foreclosure": "statusdeathcoApplicantforeclosure",
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
