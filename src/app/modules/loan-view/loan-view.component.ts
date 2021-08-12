import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/models/Constants';
@Component({
  selector: 'app-loan-view',
  templateUrl: './loan-view.component.html',
  styleUrls: ['./loan-view.component.css']
})
export class LoanViewComponent implements OnInit {
  loanId:number;
  loanDetails:any;
  dateFormat: any = Constants.dateFormat1;
  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loanId = parseInt(this.route.snapshot.paramMap.get('id'));


    this.http.LoanAccountResource(this.loanId,'all').subscribe(data => {
      this.loanDetails = data;
    });

  }
}
