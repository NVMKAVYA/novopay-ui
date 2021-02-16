import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {

  @Input() parentform : FormGroup;
  @Input() submitted: boolean;
  @Output() valuechange = new EventEmitter();
  @Input() emitEvent : boolean;
  documentForm : any;

  constructor(private fb: FormBuilder, private form : FormService) { }

  ngOnInit(): void {

    this.parentform.addControl('documentDetails' ,this.fb.group({
     'documents' : ['', Validators.required]
    }));
    this.documentForm = this.parentform.controls.documentDetails;

  }
  initDocument(){
    return this.fb.group({
      documentType : ['', Validators.required],
      confirmdocumentType: ['', Validators.required],
      otherdocumentType: ['', Validators.required],
      confirmotherdocumentType: ['', Validators.required],
      documentKey : ['', Validators.required],
      confirmdocumentKey : ['', Validators.required],
      customerIdentifierType :  ['', Validators.required],
      documentExpiryDate : [''],
      file : ['', Validators.required]
    })
  }

}
