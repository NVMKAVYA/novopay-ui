import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constants } from 'src/app/models/Constants';
import { ClientStatus } from 'src/app/models/clientStatus';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  clientStatus: ClientStatus = new ClientStatus();
  buttonsArray = {
    options: [{
      name: "button.clientscreenreports"
    }],
    singlebuttons: null
  };

  constructor(private http: HttpService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private auth: AuthService) { }

  ngOnInit(): void {
    this.clientId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.http.getclientResource(this.clientId, null, null, true).subscribe(data => {
      this.client = data;
      if (this.client.imagePresent) {
        this.http.getClientImage(this.clientId).subscribe(data => {
          this.clientImage = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        })
      }
      let buttons;
      if (this.clientStatus.statusKnown(data.status.value)) {
        buttons = this.clientStatus.getStatus(data.status.value);
      }

      if (data.status.value == "Pending" || data.status.value == "Active") {
        if (!data.staffId) {
          buttons.push(this.clientStatus.getStatus("Assign Staff"));
        }
      }

      if (this.auth.getConfiguration('enable-new-loan-button-for-client').enabled) {
        buttons.push(this.clientStatus.getStatus("New Loan"));
      }
      this.buttonsArray.singlebuttons = buttons;
    })
  }

}
