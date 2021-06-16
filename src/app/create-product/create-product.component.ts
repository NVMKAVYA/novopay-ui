import { Component, OnInit } from '@angular/core';
import { NgWizardConfig, THEME, StepValidationArgs } from 'ng-wizard';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Constants } from 'src/app/models/Constants';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  
  createProductForm : FormGroup;
  submitted : boolean;
  alphaNumericPattern : any = Constants.pattern.alphanumeric;
  productTemplate : any = {};
  config: NgWizardConfig = {
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Submit', class: 'btn btn-info', event: null  }
      ],
    }
  }

  constructor(private fb: FormBuilder, private http: HttpService) { }

  ngOnInit(): void {

    this.http.loanProductResource(null,'template').subscribe( data =>{
      this.productTemplate = data;
    })

    this.createProductForm = this.fb.group({
      productDetails : this.fb.group({
        description :  [null]
      }),
      currencyDetails : this.fb.group({}),
      termsDetails : this.fb.group({}),
      tenorGracePeriodDetails : this.fb.group({}),
      settingsDetails : this.fb.group({}),
      partPrepaymentDetails : this.fb.group({}),
      chargesDetails : this.fb.group({}),
      overdueChargesDetails : this.fb.group({}),
      assetClassificationsDetails : this.fb.group({}),
      accountingDetails : this.fb.group({}),
      demographicAuthRoleDetails : this.fb.group({})
    });

  }

  validateCanExit(form) {
    let canExit = this.createProductForm.controls[form].valid ? true : false;
    this.submitted = canExit ? false : true;
    // return canExit;
    return true;
  }

  actionOnEnter(form){
    // if(form == 'addressDetails'){
     
    // }
    return true;
  }

}
