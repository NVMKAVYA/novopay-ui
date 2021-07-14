import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { SafeResourceUrl } from '@angular/platform-browser';

export interface modal {
  documentType: string;
  documentUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})

export class DocumentModalComponent extends SimpleModalComponent<modal, boolean> implements modal, OnInit {

  documentType: string;
  documentUrl: SafeResourceUrl;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.documentUrl;
  }

  confirm() {
    this.close();
  }
}


