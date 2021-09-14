import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http/http.service';
import { STEP_STATE, NgWizardConfig, THEME } from 'ng-wizard';
import { Constants } from 'src/app/models/Constants';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css']
})
export class CreateClientComponent implements OnInit {

  qdeForm: FormGroup;
  dateOfBirthFormat: string = Constants.dateFormat2;
  dropdownOptions: any = {};
  submitted: boolean;
  alphabetsPattern: any = Constants.pattern.alphabets;
  numberPattern: any = Constants.pattern.postalcode;
  salutationmatrices: any;
  errorforSalutation: string;
  countryOptions: any;
  stateOptions: any;
  districtOptions: any;
  vtcOptions: any;
  maxActivationDate: string;
  enableSpouseDetailsTab: any = STEP_STATE.hidden;
  isSpouseMandatory: boolean = false;
  addressForm: any;
  activateDocumentTab: boolean = false;
  formData: any = {};
  webChannelId: number;
  parentFormError: boolean = false;
  config: NgWizardConfig = {
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Submit', class: 'btn btn-info', event: null }
      ],
    }
  }


  constructor(private fb: FormBuilder, private http: HttpService, private datePipe: DatePipe,
    private loader: LoaderService) { }

  ngOnInit(): void {

    this.http.clientTemplateResource().subscribe(data => {
      this.dropdownOptions = data;
    })

    this.http.codeValuesResource('ChannelTypes').subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].name == 'Web') {
          this.webChannelId = data[i].id;
          break;
        }
      }
    })

    this.http.getSalutationMatrix().subscribe(data => {
      this.salutationmatrices = data;
    })

    this.maxActivationDate = this.datePipe.transform(new Date(), this.dateOfBirthFormat);

    this.qdeForm = this.fb.group({
      personalDetails: this.fb.group({}),
      fatherDetails: this.fb.group({}),
      addressDetails: this.fb.group({
        addressLine: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]]
      }),
      staffDetails: this.fb.group({}),
      communicationAddressDetails: this.fb.group({
        addressLine: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]]
      }),
      documentDetails: this.fb.group({})
    })
    this.addressForm = this.qdeForm.controls.addressDetails;
    this.config.toolbarSettings.toolbarExtraButtons[0].event = () => {
      this.loader.scrollToTop();
      if (this.qdeForm.valid) {
        this.parentFormError = false;
        this.formData.client = {};
        this.formData.client.originationChannelTypeId = this.webChannelId;
        this.formData.client.locale = Constants.lang;
        this.formData.client.dateFormat = Constants.dateFormat2;
        Object.keys(this.qdeForm.controls).forEach(formName => {
          let form = this.qdeForm.get(formName) as FormGroup;
          Object.keys(form.controls).forEach(field => {
            if (!field.includes('confirm'))
              this.formData.client[field] = form.get(field).value;
          })
        })
      } else {
        this.parentFormError = true;
      }
    }
  }

  getGenders(value) {
    if (value) {
      let genderOptions = [];
      for (let i = 0; i < this.salutationmatrices.length; i++) {
        if (this.salutationmatrices[i].salutationId == value) {
          genderOptions.push({ id: this.salutationmatrices[i].genderId, name: this.salutationmatrices[i].gender });
        }
      }
      if (!genderOptions.length) {
        var name = this.dropdownOptions.customerTitleOptions.filter((title) => {
          return title.id == value
        });
        this.errorforSalutation = 'Gender for ' + name[0].name + ' is not configured';
      } else {
        this.dropdownOptions.genderOptions = genderOptions;
      }
    };
  }

  getCustomerTitles(value) {
    if (value) {
      let customerTitlesOptions = [];
      for (let i = 0; i < this.salutationmatrices.length; i++) {
        if (this.salutationmatrices[i].genderId == value) {
          customerTitlesOptions.push({ id: this.salutationmatrices[i].salutationId, name: this.salutationmatrices[i].salutation });
        }
      }
      if (!customerTitlesOptions.length) {
        var name = this.dropdownOptions.genderOptions.filter((gender) => {
          return gender.id == value
        });
        this.errorforSalutation = 'Title for ' + name[0].name + ' is not configured';;
      } else {
        this.dropdownOptions.customerTitlesOptions = customerTitlesOptions;
      }
    };
  }

  getStates(value) {
    if (value) {
      this.http.getstateDetailResource(value).subscribe(data => {
        this.stateOptions = data;
        this.addressForm.get('stateId').reset();
        this.addressForm.get('districtId')?.reset();
        this.addressForm.get('vtcId')?.reset();
      })
    };
  }

  getDistricts(value) {
    if (value) {
      this.http.getdistrictDetailResource(value,
        this.addressForm.get('countryId').value).subscribe(data => {
          this.districtOptions = data;
          this.addressForm.get('districtId')?.reset();
          this.addressForm.get('vtcId')?.reset();
        })
    };
  }

  getVTCs(value) {
    if (value) {
      this.http.getvillageTownCityDetailResource(value).subscribe(data => {
        this.vtcOptions = data.pageItems;
        this.addressForm.get('vtcId')?.reset();
      })
    };
  }

  getLinkedVillages(value) {
    this.http.employeeResource(value).subscribe(data => {
      if (data.officeId) {
        this.http.officeResource(data.officeId, 'villageTownCities').subscribe((data1) => {
          this.dropdownOptions.linkedVillages = data1.villageTownCities;
        });
      }
    })
  }

  addSpouseForm(value) {
    if (value.name == "Married") {
      this.qdeForm.addControl('spouseDetails', this.fb.group({
        spouseTitleId: [null, [Validators.required]]
      }))
      this.enableSpouseDetailsTab = STEP_STATE.normal;
      this.isSpouseMandatory = true;
    } else {
      if (this.qdeForm.controls.spouseDetails) {
        this.qdeForm.removeControl('spouseDetails');
        this.enableSpouseDetailsTab = STEP_STATE.hidden;
        this.isSpouseMandatory = false;
      }
    }
  }

  validateCanExit(form) {
    let canExit = this.qdeForm.controls[form].valid ? true : false;
    this.submitted = canExit ? false : true;
    // return canExit;
    return true;
  }

  actionOnEnter(form) {
    if (form == 'addressDetails' && !this.countryOptions) {
      this.http.getcountryDetailResource().subscribe(data => {
        this.countryOptions = data
      })
    } else if (form == 'documentDetails') {
      this.activateDocumentTab = true
    }
    this.submitted = false;
    this.loader.scrollToTop();
    return true;
  }

  // stepChanged(args: StepChangedArgs) {
  //   console.log(args.step);
  // }

}
