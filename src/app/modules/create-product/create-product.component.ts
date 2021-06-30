import { Component, OnInit } from '@angular/core';
import { NgWizardConfig, THEME } from 'ng-wizard';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from 'src/app/models/Constants';
import { HttpService } from 'src/app/services/http/http.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { FormService } from 'src/app/services/form/form.service';


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
  loanCycleTypes : any = [];
  workflows : any = [
    {"name":"MEL Unsecured","key":"MELUnsecured"},
    {"name":"JLGRegular","key":"jlgRegular"},
    {"name":"JLGBC","key":"jlgBC"},
    {"name":"Subsidiary JLG","key":"subsidiaryJLG"},
    {"name" : "Suvidha Shakti", "key" : "SuvidhaShakti"},
    {"name" : "JLGSeasonal", "key" : "jlgSeasonal"}
  ];;
  minDate : string;
  numberPattern : any = Constants.pattern.numbers;
  numberDecimalPattern : any = Constants.pattern.numberWithDecimal;
  showLoanDocumentList : boolean = false;
  insuranceProducts : any = [];
  termForm : any;
  interestRateFrequencyType : string;
  packInsurance: boolean = true;
  showLoanCycle: boolean = false;
  fieldsForuseBorrowerCycle : any = [
    'minPrincipal','principal','maxPrincipal',
    'minNumberOfRepayments','numberOfRepayments','maxNumberOfRepayments',
    'minInterestRatePerPeriod','interestRatePerPeriod','maxInterestRatePerPeriod'
  ]
  config: NgWizardConfig = {
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Submit', class: 'btn btn-info', event: null  }
      ],
    }
  }

  constructor(private fb: FormBuilder, private http: HttpService, private datePipe: DatePipe,
    private loader : LoaderService, private form : FormService) { }

  ngOnInit(): void {
    
    this.minDate = this.datePipe.transform( new Date(), Constants.dateFormat2);
  
    this.http.loanProductResource(null,'template').subscribe( data =>{
      this.productTemplate = data;
      this.interestRateFrequencyType = this.productTemplate.interestRateFrequencyType.name;
      this.termForm.addControl('interestRateFrequencyType' ,this.fb.control( this.productTemplate.interestRateFrequencyType.id ));
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
    this.termForm.addControl('packs' ,this.fb.array([this.initPack()]));
  }

  showInsuranceProduct(){
    this.packInsurance = this.createProductForm.controls.productDetails.get('processDefKey').value === "subsidiaryJLG" ? false : true;
    this.showLoanCycle = (this.createProductForm.controls.productDetails.get('processDefKey').value === "subsidiaryJLG" 
         && this.createProductForm.controls.productDetails.get('loanClassificationType').value === 1) ? true : false;
    if(this.showLoanCycle && !this.loanCycleTypes.length){
      this.http.codeValuesResource('Loan Cycle').subscribe( data =>{
        this.loanCycleTypes = data;
      })
    }
  }

  updateFields(value){
    if(value){
      this.showLoanDocumentList = value.name == 'Individual' ? true : false;
    }; 
  }

  toggleUsePacksFlag(value){
    if (value) {
      this.termForm.patchValue({usePacks : !value});
      this.termForm.removeControl('packs');
     }else{
      this.termForm.removeControl('principalVariationsForBorrowerCycle');
      this.termForm.removeControl('numberOfRepaymentVariationsForBorrowerCycle');
      this.termForm.removeControl('interestRateVariationsForBorrowerCycle');
      this.termForm.addControl('packs' ,this.fb.array([this.initPack()]));
     }
  }

  toggleUseBorrowerCycleFlag(value){
    if (value) {
      this.termForm.patchValue({useBorrowerCycle : !value});
      this.fieldsForuseBorrowerCycle.forEach(field => {
        this.termForm.removeControl(field);
      });
      this.termForm.removeControl('principalVariationsForBorrowerCycle');
      this.termForm.removeControl('numberOfRepaymentVariationsForBorrowerCycle');
      this.termForm.removeControl('interestRateVariationsForBorrowerCycle');
      this.termForm.addControl('packs' ,this.fb.array([this.initPack()]));
    }else{ 
      this.fieldsForuseBorrowerCycle.forEach(field => {
        this.termForm.addControl( field ,this.fb.control( null, [ 
          Validators.pattern(this.numberPattern.regex)
        ]));
      });
      this.termForm.removeControl('packs');
    }
  }

  addVariation(type:string){
    if(this.termForm.get(type)){
      this.termForm.controls.numberOfRepaymentVariationsForBorrowerCycle.push(this.initRow())
    }else{
      this.termForm.addControl(type ,this.fb.array([this.initRow()]));
    }
  }

  deleteVariation(i : number, type: string){
    this.termForm.get(type).removeAt(i);
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

  addPack(){
    this.termForm.controls.pack.push(this.initPack())
  }

  initPack(){
    let row = this.fb.group({});
    row.addControl('packShortName',this.fb.control(null))
    row.addControl('principal',this.fb.control(null,[Validators.pattern(this.numberPattern.regex)]))
    row.addControl('interestRate',this.fb.control(null,[Validators.pattern(this.numberDecimalPattern.regex)]))
    row.addControl('numberOfRepayments',this.fb.control(null, [Validators.pattern(this.numberPattern.regex)]))
    row.addControl('insuranceAmount',this.fb.control(row.get('principal').value))
    row.addControl('packInsuranceProductid',this.fb.control(null,
       [this.form.conditionalValidator(this.packInsurance, Validators.required)]))
    row.addControl('isEligibilityNoRTR',this.fb.control(true))
    row.addControl('pkLoanCycleId',this.fb.control(null,
      [this.form.conditionalValidator(this.showLoanCycle, Validators.required)]))
    return row;
  }
  
  deletePack(i:number){
    this.termForm.get('packs').removeAt(i);
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
