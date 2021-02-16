import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http/http.service';
import { STEP_STATE, StepValidationArgs } from 'ng-wizard';
import { Constants } from 'src/app/models/Constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css'],
})
export class CreateClientComponent implements OnInit {

  qdeForm : FormGroup;
  dateOfBirthFormat : string  = Constants.dateFormat2;
  dropdownOptions : any = {};
  submitted : boolean;
  alphabetsPattern : any = Constants.pattern.alphabets; 
  numberPattern : any = Constants.pattern.postalcode;
  salutationmatrices : any;
  errorforSalutation : string;
  countryOptions : any;
  stateOptions :any;
  districtOptions : any;
  vtcOptions : any;
  maxActivationDate : string;
  datePickerConfig = {
    format: Constants.datePickerFormat,
    max : ''
  }
  enableSpouseDetailsTab : any = STEP_STATE.hidden;
  isSpouseMandatory : boolean = false;
  addressForm : any;

  constructor(private fb: FormBuilder, private http: HttpService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.maxActivationDate = this.datePipe.transform( new Date(), this.dateOfBirthFormat);
    this.datePickerConfig.max = this.maxActivationDate;
    this.qdeForm = this.fb.group({
      personalDetails : this.fb.group({}),
      fatherDetails : this.fb.group({}),
      addressDetails : this.fb.group({
        addressLine :  [null ,[ Validators.required, Validators.maxLength(100),Validators.minLength(5)]],
        landMark : [null ,[ Validators.required, Validators.maxLength(100)]],
        postalCode :  [null ,[ Validators.required, Validators.maxLength(6),Validators.minLength(6),
          Validators.pattern(this.numberPattern.regex)]]
      }),
      staffDetails : this.fb.group({
        activationdate :  [this.maxActivationDate,[ Validators.required]]
      }),
      communicationAddressDetails : this.fb.group({
        addressLine :  [null ,[ Validators.required, Validators.maxLength(100),Validators.minLength(5)]],
        landMark : [null ,[ Validators.required, Validators.maxLength(100)]]
      })
    })
       
    this.http.clientTemplateResource().subscribe( data =>{
      this.dropdownOptions = data;
    })

    this.addressForm = this.qdeForm.controls.addressDetails;

  }

  getStates(value){
      if( value ){
        this.http.getstateDetailResource(value).subscribe(data =>{
          this.stateOptions = data;
          this.addressForm.get('stateId').reset();
          this.addressForm.get('districtId').reset();
          this.addressForm.get('vtcId').reset();
        })
      };
  }

  getDistricts(value){
    if( value ){
      this.http.getdistrictDetailResource(value,
        this.addressForm.get('countryId').value).subscribe(data =>{
        this.districtOptions = data;
        this.addressForm.get('districtId').reset();
        this.addressForm.get('vtcId').reset();
      })
    };
  }

  getVTCs( value ){
    if( value ){
      this.http.getvillageTownCityDetailResource(value).subscribe(data =>{
        this.vtcOptions = data.pageItems;
        this.addressForm.get('vtcId').reset();
      })
    };
  }

  getLinkedVillages( value ){
   this.http.employeeResource(value).subscribe(data =>{
     if(data.officeId){
       this.http.officeResource(data.officeId,'villageTownCities').subscribe((data1)=>{
           this.dropdownOptions.linkedVillages = data1.villageTownCities;
       });
     }
   })
  }

  addSpouseForm(value){
    if(value.name == "Married"){
        this.qdeForm.addControl('spouseDetails',this.fb.group({
        spouseTitleId : [null ,[ Validators.required]]
        }))
        this.enableSpouseDetailsTab = STEP_STATE.normal;
        this.isSpouseMandatory = true;
    }else{
      if(this.qdeForm.controls.spouseDetails){
        this.qdeForm.removeControl('spouseDetails');
        this.enableSpouseDetailsTab = STEP_STATE.hidden;
        this.isSpouseMandatory = false;
      }
    }
  }

  validateCanExit(form, args: StepValidationArgs) {
    let canExit = this.qdeForm.controls[form].valid ? true : false;
    this.submitted = canExit ? false : true;
    // return canExit;
    return true;
  }

  actionOnEnter(form){
    if(form == 'addressDetails' && !this.countryOptions){
      this.http.getcountryDetailResource().subscribe(data =>{
        this.countryOptions = data
      })
    }
    this.submitted =  false;
    return true;
  }

   // this.http.getSalutationMatrix().subscribe( data =>{
    //   this.salutationmatrices = data;
    // })

    // this.qdeForm.controls.personalDetails.controls.customertitle.valueChanges.pipe().subscribe(() => {
    //   if( this.qdeForm.controls.personalDetails.controls.customertitle.value){
    //     let genderOptions = [];
    //     for( let i = 0; i < this.salutationmatrices.length; i ++){
    //       if(this.salutationmatrices[i].salutationId == this.qdeForm.controls.personalDetails.controls.customertitle.value){
    //         genderOptions.push({ id : this.salutationmatrices[i].genderId, name : this.salutationmatrices[i].gender});
    //       }
    //     }
    //     if(!genderOptions.length){
    //       var name = this.customerTitleOptions.filter((title)=>{
    //             return title.id == this.qdeForm.controls.personalDetails.controls.customertitle.value
    //       });
    //       this.errorforSalutation = 'Gender for ' + name[0].name + ' is not configured';
    //     }else{
    //        this.genderOptions = genderOptions;
    //     }
    //   };
    // })

    // stepChanged(args: StepChangedArgs) {
  //   console.log(args.step);
  // }

}
