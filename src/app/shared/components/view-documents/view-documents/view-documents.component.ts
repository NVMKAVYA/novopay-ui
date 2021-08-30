import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent implements OnInit {

  @Input() type: string;
  @Input() documents: any;
  @Input() typeId: any;
  @Input() viewbuttons: boolean;
  @Output() valuechange = new EventEmitter();

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments() {
    if (!this.documents) {
      switch (this.type) {

        case 'clients':
          this.http.getDocuments(this.type, this.typeId[0]).subscribe(data => {
            this.documents = data;
            this.valuechange.emit(this.documents);
          })
          break;
        case 'loans':
          forkJoin([this.http.getDocuments(this.type, this.typeId[0]), this.http.getDocuments('LOANAPPLICATIONREFERENCE', this.typeId[1])]).subscribe((data: any) => {
            this.documents = data[0];
            data[1].forEach(e => {
              e.hideEdit = true;
              this.documents.push(e);
            });
            this.valuechange.emit(this.documents);
          });
          break;
      }
    }
  }

}
