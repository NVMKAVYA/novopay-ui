import { Directive, Input, HostListener } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { DocumentModalComponent } from './document-modal.component';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[document]'
})
export class DocumentModalDirective {

  @Input() entityType: string;
  @Input() entityId: number;
  @Input() document: any;
  @Input('document') action: string;
  documentUrl: SafeResourceUrl;
  documentType: string;

  constructor(private http: HttpService, private sanitizer: DomSanitizer, private auth: AuthService, private modal: SimpleModalService, private toastr: ToastrService) { }

  @HostListener('click') onClick() {
    if (this.action === 'view') {
      if (this.entityType === 'clientImage') {
        this.http.getClientImage(this.entityId, 'maxWidth=580').subscribe(data => {
          this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data)
          this.showModal();
        })
      } else {
        this.entityType = this.entityType != 'clientSignature' ? this.entityType : 'clients';
        this.http.getDocuments(this.entityType, this.entityId).subscribe(data => {
          let selectedDocument = { id: null };
          data.forEach(doc => {
            if (selectedDocument.id < doc.id) {
              selectedDocument = doc;
            }
          });
          this.checkDocument(selectedDocument);
        })
      }
    }
  }


  checkDocument(document) {
    this.documentType = document.type;
    if (document.isFileExists) {
      if (document.type === 'application/pdf') {
        this.http.getPdf(this.entityType, this.entityId, document.id, this.auth.getOtp(), this.auth.userData.userId).subscribe(data => {
          if (data) {
            this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + data.data);
          }
          this.showModal();
        });
      } else {
        this.documentUrl = this.http.getImageUrl(this.entityType, this.entityId, document.id, this.auth.getOtp(), this.auth.userData.userId);
        this.showModal();
      }
    } else if (document.dmsUpload) {
      if (document.folderIndex) {
        if (this.auth.getDmsUrl) {
          window.open(this.auth.getDmsUrl + document.folderIndex);
        } else {
          this.http.runReportsResource('External Docs Url', 'false').subscribe(data => {
            this.auth.setDmsUrl = data[0].value;
            window.open(this.auth.getDmsUrl + document.folderIndex);
          })
        }
      }
    } else {
      this.toastr.warning('Please upload the document as the document is not available', '', {
        timeOut: 10000
      })
    }
  }


  showModal() {
    this.modal.addModal(DocumentModalComponent, {
      documentType: this.documentType,
      documentUrl: this.documentUrl
    })
  }


}


