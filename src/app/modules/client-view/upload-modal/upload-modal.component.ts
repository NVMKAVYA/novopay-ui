import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { Constants } from 'src/app/models/Constants';
import { HttpService } from 'src/app/services/http/http.service';

export interface modal {
  type: any[];
  entityId: number
}

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})

export class UploadModalComponent extends SimpleModalComponent<modal, boolean> implements modal, OnInit {

  type: any[];
  entityId: number;
  mimetypesForImage: string = Constants.supportedMimeTypesForClientImage;
  mimetypes: string = Constants.supportedMimeTypes;
  file: any;

  constructor(private http: HttpService) {
    super();
  }

  ngOnInit(): void { }

  onFileChange(files: any) {
    this.file = files[0];
  }

  submit() {
    if (this.file) {
      let uploadData = new FormData();
      uploadData.append('file', this.file);
      if (this.type[0] == 'Client Image') {
        this.http.postClientImage(this.entityId, uploadData).subscribe(() => {
          this.result = true;
          this.close();
        })
      } else if (this.type[0] == 'Client Signature') {
        uploadData.append('name', 'clientSignature');
        uploadData.append('description', 'client signature');
        this.http.postDocuments('clients', this.entityId, uploadData).subscribe(() => {
          this.result = true;
          this.close();
        })
      } else {
        uploadData.append('name', this.type[1]);
        this.http.postDocuments('client_identifiers', this.entityId, uploadData).subscribe(() => {
          this.result = true;
          this.close();
        })
      }
    }
  }

  cancel() {
    this.close();
  }
}
