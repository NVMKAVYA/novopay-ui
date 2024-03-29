import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { DocumentModalComponent } from './document-modal.component';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[documentView]'
})
export class DocumentModalDirective {

  @Input() entityType: string;
  @Input() entityId: number;  /*Must for Client Image, Client Signature, optional for loan/loanappref/client documents*/
  @Input() document: any;
  @Input('documentView') action: string;
  @Output() valuechange = new EventEmitter();  /*optional*/
  documentUrl: any;
  documentType: string;


  constructor(private http: HttpService, private sanitizer: DomSanitizer, private auth: AuthService, private modal: SimpleModalService, private toastr: ToastrService) { }

  @HostListener('click') onClick() {
    if (this.entityType === 'clientImage') {
      this.http.getClientImage(this.entityId, 'maxWidth=580').subscribe(data => {
        this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data)
        this.showModal();
      })
    } else if (this.entityType == 'clientSignature' && this.document) {
      this.findSignatureDocument(this.document);
    } else if (this.entityType == 'clientSignature' && !this.document) {
      this.http.getDocuments('clients', this.entityId).subscribe(data => {
        this.document = data;
        this.valuechange.emit(this.document);
        this.findSignatureDocument(data);
      })
    } else {
      this.analyzeDocument(this.document, this.entityType || this.document.parentEntityType);
    }
  }

  findSignatureDocument(data) {
    let selectedDocument = { id: null };
    data.forEach(doc => {
      if (selectedDocument.id < doc.id && doc.name.toUpperCase() == 'clientSignature'.toUpperCase()) {
        selectedDocument = doc;
      }
    });
    this.analyzeDocument(selectedDocument, 'clients');
  }

  analyzeDocument(document, type) {
    this.documentType = document.type;
    if (document.isFileExists) {
      if (document.type === 'application/pdf' && this.action == 'view') {
        this.http.getPdf(type, this.entityId || this.document.parentEntityId, document.id, this.auth.getOtp(), this.auth.userData.userId).subscribe(data => {
          if (data) {
            this.documentUrl = this.base64ToArrayBuffer(data);
          }
          this.showModal();
        });
      } else {
        this.documentUrl = this.http.getUrl(type, this.entityId || this.document.parentEntityId, document.id, this.auth.getOtp(), this.auth.userData.userId);
        this.action == 'view' ? this.showModal() : window.open(this.documentUrl);
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
        timeOut: 3000
      })
    }
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }


  showModal() {
    this.modal.addModal(DocumentModalComponent, {
      documentType: this.documentType,
      documentUrl: this.documentUrl
    })
  }
}


