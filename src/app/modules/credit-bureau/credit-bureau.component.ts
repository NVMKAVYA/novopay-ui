import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-credit-bureau',
  templateUrl: './credit-bureau.component.html',
  styleUrls: ['./credit-bureau.component.css']
})
export class CreditBureauComponent implements OnInit {
  applicationRefId: any;
  creditbureauReportResult: any;
  tab: number;
  cBData: any;
  eligibilityReport: any;
  result: any;
  eligibleForRules: boolean;
  statusArray: any[];
  clientId: any;
  isReportAvailable: boolean;
  reportURL: string;
  tenantIdentifier: string;
  otp: any;
  userId: string;
  sessionData: any;
  dateUpload: any;
  reportExpireDate: any;
  highmarkCustomerCreationDate: any;
  reportContent: string;
  processCBData: any;



  constructor( private http: HttpService,  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.applicationRefId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.http.creditBureauResource(this.applicationRefId).subscribe(creditBureauReportResult => {
      this.creditbureauReportResult = creditBureauReportResult;

      this.highmarkPdf();
      this.processCBData();
    });

    var eligibilityRequestData = [
      {
          "requestId": 1,
          "relativeUrl": "datatables/d_eligibility_rules/"+this.applicationRefId+"?order='asc'",
          "method": "GET"
      }
  ];
    this.http.batchResource(eligibilityRequestData).subscribe(eligibilityResponseData => {
      for (var i = 0; i < eligibilityResponseData.length; i++) {
        if(eligibilityResponseData[i].requestId == 1){
            if(JSON.parse(eligibilityResponseData[i].body)[0]) {
                this.eligibilityReport = JSON.parse(JSON.parse(eligibilityResponseData[i].body)[0].rules_report);
                if(this.eligibilityReport.rulesResults){
                    this.eligibilityReport = this.eligibilityReport.rulesResults;
                }
                this.result = this.eligibilityReport;
                //console.log("----> : "+JSON.stringify(this.result));
                var statusArray = [];
                for (var property in this.result) {
                    if(this.result[property].result == "FAIL"){
                        this.eligibleForRules = false;
                    }
                    if(this.result[property].excutionOrder == undefined)
                        this.result[property].excutionOrder = property;

                    if (this.result.hasOwnProperty(property)) {
                        statusArray[this.result[property].excutionOrder] = {
                            name: property,
                            result: this.result[property]
                        };
                    }
                }
                this.statusArray  = [] ;
                var index = 0 ;
                for (var property in statusArray) {
                    if(statusArray.hasOwnProperty(property)){
                        this.statusArray[index] = statusArray[property];
                        index++;
                    }
                }
            }
        }
    }
    })
    var requestParams = {
      staffInSelectedOfficeOnly: true,
      applicationRefId: this.applicationRefId,
      associations: 'all'
  };

  this.http.loanAppRefResource(this.applicationRefId).subscribe(loanAppRefData => {
    this.clientId = loanAppRefData.clientId;
  })

  var getObjectAsArray = function(obj){

    var objArray = [];
    try {
        if (obj) {
            for (var prop in obj) {
                //skip if prop name starts with $
                if(prop.substr(0,1) === "$") continue;
                if (obj.hasOwnProperty(prop)) {
                    if (obj[prop] !== null && typeof obj[prop] === 'object') {
                        objArray.push({
                            'name': prop.replace(/[-]+/g," ").toLowerCase(),
                            'data_is_object' : true,
                            'data': getObjectAsArray(obj[prop])
                        });
                    } else {
                        objArray.push({
                            'name': prop.replace(/[-]+/g," ").toLowerCase(),
                            'data_is_object' : false,
                            'data': obj[prop]
                        });
                    }
                }

            }
        }
    } catch(e){
        /**
         * Comment console log to suppress errors
         */
        console.log("Error while converting object to array");
        console.log(e);
    }
    return objArray;
};
  
this.processCBData = function(){
  this.cBData = getObjectAsArray(this.creditbureauReportResult);
}
}
  
  highmarkPdf(){
    this.http.loanAppRefResource(this.applicationRefId).subscribe(loanAppRefData => {
      this.clientId = loanAppRefData.clientId;
    

      this.http.generateHighmarkReport(this.applicationRefId,this.clientId).subscribe(data => {
        this.isReportAvailable = data.isReportAvailable === "true";
        //var reportContent = "data:application/pdf;base64,";
     if (this.isReportAvailable) {
        this.reportURL = this.http.baseUrl + "/creditbureaureport/highmarkonlinereport/"+this.applicationRefId+"/"+this.clientId;
        var authKey = this.otp;
        this.reportURL += '?tenantIdentifier='+this.tenantIdentifier;
        this.reportURL += '&authKey='+ encodeURIComponent(authKey) + '&userId=' + this.userId;
        this.reportURL += '&authorization='+ encodeURIComponent('Custom '+ this.sessionData.authenticationKey);
        this.dateUpload = data.dateUpload;
        this.reportExpireDate = data.reportExpireDate;
        this.reportExpireDate = data.reportIsExpired === "true";
        if(data.highmarkCustomerCreationDate){
          this.highmarkCustomerCreationDate = data.highmarkCustomerCreationDate;
        }
     }
     this.reportContent = this.reportURL;
     });
    })
};

  setTab(tab: number) {
    this.tab = tab;
  }


}
