import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'aadhaarMask'
})
export class AadhaarMaskPipe implements PipeTransform {
  constructor() { }

  transform(identitydocuments: any, clientAccounts: any): unknown {
    identitydocuments.forEach((document) => {
      if (document.documentType.name == 'Aadhar') {
        if (clientAccounts.loanAccounts) {
          this.checkAadhaarMask(clientAccounts, document);
        } else {
          // todo
        }
      }
    });
    return identitydocuments;
  }
  checkAadhaarMask(clientAccounts, document) {
    clientAccounts.loanAccounts.forEach(e => {
      if (e.status.id != 200 && e.status.id != 100 && e.status.id != 500 && e.status.id != 501 && e.status.id != 502) {
        if (document.documentKey.length == 14) {
          let maskedAadhaarNumber = 'XXXX XXXX ';
          document.documentKey = maskedAadhaarNumber + document.documentKey.substring(10);
        }
        else {
          let maskedAadhaarNumber = 'XXXXXXXX';
          document.documentKey = maskedAadhaarNumber + document.documentKey.substring(8);
        }
      }
    })
  }
}






