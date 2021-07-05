import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { HttpService } from 'src/app/services/http/http.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ConfirmModel {
  entityType: string;
  entityId: number;
}

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})

export class DocumentModalComponent extends SimpleModalComponent<ConfirmModel, boolean> implements ConfirmModel, OnInit {

  entityType: string;
  entityId: number;
  clientImage: SafeResourceUrl;

  constructor(private http: HttpService, private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.http.getClientImage(this.entityId, 'maxWidth=580').subscribe(data => {
      this.clientImage = this.sanitizer.bypassSecurityTrustResourceUrl(data);
    })
  }

  confirm() {
    this.result = true;
    this.close();
  }
}


