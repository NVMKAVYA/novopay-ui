import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constants } from 'src/app/models/Constants';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {

  clientId: number;
  clientImage: SafeResourceUrl;
  client: any;
  dateFormat: any = Constants.dateFormat1;

  constructor(private http: HttpService, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.clientId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.http.getclientResource(this.clientId, null, null, true).subscribe(data => {
      this.client = data;
      if (this.client.imagePresent) {
        this.http.getClientImage(this.clientId).subscribe(data => {
          this.clientImage = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        })
      }
    })

  }

}
