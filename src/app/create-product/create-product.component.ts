import { Component, OnInit } from '@angular/core';
import { NgWizardConfig, THEME } from 'ng-wizard';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from 'src/app/models/Constants';
import { HttpService } from 'src/app/services/http/http.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/services/loader/loader.service';


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
  workflows : any = [];
  minDate : string;
  numberPattern : any = Constants.pattern.numbers;
  showLoanDocumentList : boolean = false;
  insuranceProducts : any = [];
  termForm : any;
  config: NgWizardConfig = {
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Submit', class: 'btn btn-info', event: null  }
      ],
    }
  }

  constructor(private fb: FormBuilder, private http: HttpService, private datePipe: DatePipe,
    private loader : LoaderService) { }

  ngOnInit(): void {
    
    this.minDate = this.datePipe.transform( new Date(), Constants.dateFormat2);
    this.workflows = [
      {"name":"MEL Unsecured","key":"MELUnsecured"},
      {"name":"JLGRegular","key":"jlgRegular"},
      {"name":"JLGBC","key":"jlgBC"},
      {"name":"Subsidiary JLG","key":"subsidiaryJLG"},
      {"name" : "Suvidha Shakti", "key" : "SuvidhaShakti"},
      {"name" : "JLGSeasonal", "key" : "jlgSeasonal"}
    ];

    this.http.loanProductResource(null,'template').subscribe( data =>{
      this.productTemplate = data;
    })

    this.http.insuranceProductListResource().subscribe( data =>{
      this.insuranceProducts = data;
    })

    this.createProductForm = this.fb.group({
      productDetails : this.fb.group({
        description :  [null]  //maxlength, pattern needed
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
    this.termForm = this.createProductForm.controls.termsDetails;

  }

  updateFields(value){
    if(value){
          if(value.name == 'Individual'){
            this.showLoanDocumentList = true;
          }else{
            this.showLoanDocumentList =  false;
          }
    }; 
  }

  toggleUsePacksFlag(value){
    if (value) {
      this.termForm.patchValue({usePacks : !value});
     }else{
      this.termForm.removeControl('principalVariationsForBorrowerCycle');
      this.termForm.removeControl('numberOfRepaymentVariationsForBorrowerCycle');
      this.termForm.removeControl('interestRateVariationsForBorrowerCycle');
     }
  }

  toggleUseBorrowerCycleFlag(value){
    if (value) {
      this.termForm.patchValue({useBorrowerCycle : !value});
      this.termForm.removeControl('minPrincipal');
      this.termForm.removeControl('principal');
      this.termForm.removeControl('maxPrincipal');
      this.termForm.removeControl('principalVariationsForBorrowerCycle');
      this.termForm.removeControl('minNumberOfRepayments');
      this.termForm.removeControl('numberOfRepayments');
      this.termForm.removeControl('maxNumberOfRepayments');
      this.termForm.removeControl('numberOfRepaymentVariationsForBorrowerCycle');
      this.termForm.removeControl('minInterestRatePerPeriod');
      this.termForm.removeControl('interestRatePerPeriod');
      this.termForm.removeControl('maxInterestRatePerPeriod');
      this.termForm.removeControl('interestRateFrequencyType');
      this.termForm.removeControl('interestRateVariationsForBorrowerCycle');
    }else{ 
      this.termForm.addControl( 'minPrincipal' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'principal' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'maxPrincipal' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'minNumberOfRepayments' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'numberOfRepayments' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'maxNumberOfRepayments' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'minInterestRatePerPeriod' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'interestRatePerPeriod' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'maxInterestRatePerPeriod' ,this.fb.control( null, [ 
        Validators.pattern(this.numberPattern.regex)
      ]));
      this.termForm.addControl( 'interestRateFrequencyType' ,this.fb.control( this.productTemplate.interestRateFrequencyType.id ));
    }
  }

  addPrincipalVariation(){
    if(this.termForm.get('principalVariationsForBorrowerCycle')){
      this.termForm.controls.numberOfRepaymentVariationsForBorrowerCycle.push(this.initRow())
    }else{
      this.termForm.addControl('principalVariationsForBorrowerCycle' ,this.fb.array([this.initRow()]));
    }
  }

  addNumberOfRepaymentVariation(){
    if(this.termForm.get('numberOfRepaymentVariationsForBorrowerCycle')){
      this.termForm.controls.numberOfRepaymentVariationsForBorrowerCycle.push(this.initRow())
    }else{
      this.termForm.addControl('numberOfRepaymentVariationsForBorrowerCycle' ,this.fb.array([this.initRow()]));
    }
  }

  addInterestRateVariation(){
    if(this.termForm.get('interestRateVariationsForBorrowerCycle')){
      this.termForm.controls.numberOfRepaymentVariationsForBorrowerCycle.push(this.initRow())
    }else{
      this.termForm.addControl('interestRateVariationsForBorrowerCycle' ,this.fb.array([this.initRow()]));
    }
  }

  deletePrincipalVariation(i : number){
    this.termForm.get('principalVariationsForBorrowerCycle').removeAt(i);
  }

  deleterepaymentVariation(i : number){
    this.termForm.get('numberOfRepaymentVariationsForBorrowerCycle').removeAt(i);
  }

  deleteInterestRateVariation(i : number){
    this.termForm.get('interestRateVariationsForBorrowerCycle').removeAt(i);
  }

  initRow(){
    let row = this.fb.group({});
    row.addControl('valueConditionType',this.fb.control(this.productTemplate.valueConditionTypeOptions[0].id))
    row.addControl('borrowerCycleNumber',this.fb.control(null))
    row.addControl('minValue',this.fb.control(null))
    row.addControl('defaultValue',this.fb.control(null))
    row.addControl('maxValue',this.fb.control(null))
    return row;
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
    this.submitted =  false;
    this.loader.scrollToTop();
    return true;
  }

}
