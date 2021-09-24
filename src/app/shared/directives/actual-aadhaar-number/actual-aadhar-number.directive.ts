import { Directive, HostListener, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { ActualAadhaarNumberComponent } from './actual-aadhar-number.component';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[actualAadhaar]'
})
export class ActualAadhaarNumberDirective {

  @Input() document: any;
  @Input() clientId: number;   /*optional*/
  actualAadhaarNumber: string;

  constructor(private http: HttpService, private modal: SimpleModalService, private toastr: ToastrService) { }
  @HostListener('click') onClick() {
    this.http.aadharVaultGetApiResource(this.document.clientId || this.clientId, this.document.documentKey.replace(/\s+/g, '')).subscribe(response => {
      if (response.errorDescription) {
        this.toastr.error('Unable to fetch the Aadhaar number from the service', '', {
          timeOut: 10000
        })
      }
      if (response.data) {
        this.actualAadhaarNumber = response.data ? response.data.split(/(\d{4})/).join(' ').trim() : null;
        this.showModal();
      }
    })
  }

  showModal() {
    this.modal.addModal(ActualAadhaarNumberComponent, {
      actualAadhaarNumber: this.actualAadhaarNumber,
    })
  }
}
