import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormService } from 'src/app/services/form/form.service';
import { HttpService } from 'src/app/services/http/http.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Constants } from 'src/app/models/Constants';
import { DatePipe } from '@angular/common';
// declare var $: any;

@Component({
  selector: 'app-document-upload',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class DocumentUploadComponent implements OnInit {

  @Input() parentform: FormGroup;
  @Input() submitted: boolean;

  documenttypes: any;
  otherdocumenttypes: any;
  identifiertypes: any;
  identifiertypesOptions = [];
  datePickerConfig = {
    format: Constants.datePickerFormat,
    min: ''
  }
  selectedIdentifiers: any = [];
  identityErrorMessage: string;

  get formArray() {
    return this.parentform.get("documents") as FormArray;
  }

  constructor(private fb: FormBuilder, private form: FormService, private http: HttpService, private auth: AuthService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.parentform.addControl('documents', this.fb.array([this.initDocument()]));
    this.datePickerConfig.min = this.datePipe.transform(new Date(), Constants.dateFormat2);

    this.http.codeValuesResource('Customer Identifier', 'jlgRegular').subscribe(data => {
      this.documenttypes = data;
      this.documenttypes.forEach(type => {
        type.isValidTillRequired = (type.name == 'Passport' ||
          type.name == 'Drivers License' ||
          type.name == 'Aadhaar Enrollment Number') ? true : false;
        if (type.name == 'AnyOtherDocument') {
          type.isOtherDocsRequired = true;
          type.isPasswordRequired = true;
        } else {
          type.isOtherDocsRequired = false;
          type.isPasswordRequired = false;
        }
      });
    })
    this.http.codeValuesResource('Any Other Documents').subscribe(data => {
      this.otherdocumenttypes = data;
    })
    this.http.codeValuesResource('CustomerIdentifierType').subscribe(data => {
      this.identifiertypes = data;
    })
  }

  initDocument() {
    let row = this.fb.group({});
    row.addControl('documentType', this.fb.control(null, [Validators.required]))
    row.addControl('confirmdocumentType', this.fb.control({ value: null, disabled: true },
      [Validators.required, this.form.mustMatch('documentType', row)]))
    row.addControl('documentKey', this.fb.control(null,
      [Validators.required]))
    row.addControl('confirmdocumentKey', this.fb.control({ value: null, disabled: true },
      [Validators.required, this.form.mustMatch('documentKey', row)]))
    row.addControl('identifierTypeId', this.fb.control(null, [Validators.required]))
    row.addControl('documentExpiryDate', this.fb.control(null))
    row.addControl('file', this.fb.control(null, [this.form.conditionalValidator(this.auth.getConfiguration('is_kyc_upload_required').enabled,
      Validators.required)]))
    return row;
  }

  fetchDetails(i) {
    let form = this.formArray.controls[i] as FormGroup;
    let type = form.get('documentType').value;
    form.get('confirmdocumentType').enable();
    let key = form.get('documentKey');
    key.reset();
    form.get('confirmdocumentKey').reset();
    switch (type.name) {

      case "Passport": key.setValidators([Validators.required,
      Validators.pattern('^[A-Za-z]{1}\d{7}$')])
        break;
      case "PAN": key.setValidators([Validators.required,
      Validators.pattern('^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$')])
        break;
      case "Voter Id": key.setValidators([Validators.required,
      Validators.pattern('^([a-zA-Z0-9\\\/]{1,' +
        this.auth.getConfiguration('voter_id_max_length').value + '})$')])
        break;
      case "Aadhar": key.setValidators([Validators.required,
      this.validateAadhaar()])
        break;
      case "Aadhaar Enrollment Number": key.setValidators([Validators.required,
      Validators.pattern('^(?!0{28})[\d]{28}$')])
        form.get('file').clearValidators();
        form.get('file').updateValueAndValidity();
        break;
      case "National Population Register": key.setValidators([Validators.required,
      Validators.pattern('^(?!0{20})[\d]{20}$')])
        break;
      default: key.setValidators([Validators.required,
      Validators.pattern('^(?!0{5,})[\w\\\/\s-]{2,}$'),
      Validators.maxLength(30)])
        break;

    }
    if (type.isOtherDocsRequired) {
      form.addControl('otherdocumentType', this.fb.control(null, [Validators.required]));
      form.addControl('confirmotherdocumentType', this.fb.control(null, [Validators.required,
      this.form.mustMatch('otherdocumentType', form)]));
    } else {
      if (form.get('otherdocumentType')) {
        form.removeControl('otherdocumentType');
        form.removeControl('confirmotherdocumentType');
      }
    }
    if (type.isValidTillRequired) {
      form.get('documentExpiryDate').enable()
      form.get('documentExpiryDate').setValidators([Validators.required]);
    } else {
      form.get('documentExpiryDate').disable()
      form.get('documentExpiryDate').clearValidators();
    }
    let contextTypes = type.context.split(",");
    let idOptions = [];
    for (let i = 0; i < contextTypes.length; i++) {
      for (let j = 0; j < this.identifiertypes.length; j++) {
        if (contextTypes[i] == this.identifiertypes[j].name) {
          idOptions.push(this.identifiertypes[j]);
        }
      }
    }
    if ((contextTypes.indexOf("ProofOfIdentity") != -1) && (contextTypes.indexOf("ProofOfAddress") != -1)) {
      idOptions = this.identifiertypes;
    }
    this.identifiertypesOptions[i] = idOptions;
  }

  validateAadhaar(): ValidatorFn {
    return (array: AbstractControl): { [key: string]: any } | null => {
      let c = 0;
      let d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
      ];
      // permutation table p
      let p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
      ];

      if (array.value) {
        let invertedArray = this.invArray(array.value);

        for (let i = 0; i < invertedArray.length; i++) {
          c = d[c][p[(i % 8)][invertedArray[i]]];
        }
        return (c === 0) ? null : { invalidAadhaar: true };
      }
    }
  }

  invArray(array) {
    if (Object.prototype.toString.call(array) == "[object Number]") {
      array = String(array);
    }

    if (Object.prototype.toString.call(array) == "[object String]") {
      array = array.split("").map(Number);
    }
    return array.reverse();
  }

  addIdentifier(i, value) {
    this.selectedIdentifiers[i] = this.identifiertypesOptions[i].findIndex(type => type.id == value);
    this.selectedIdentifiers[i] = this.identifiertypesOptions[i][this.selectedIdentifiers[i]].name;
    if (this.selectedIdentifiers.indexOf("Both") == -1) {
      if (this.selectedIdentifiers.indexOf("ProofOfIdentity") == -1) {
        this.identityErrorMessage = '**Minimum one Proof of Identity is required'
      } else if (this.selectedIdentifiers.indexOf("ProofOfAddress") == -1) {
        this.identityErrorMessage = '**Minimum one Proof of Address is required'
      } else {
        this.identityErrorMessage = '';
      }
    } else {
      this.identityErrorMessage = '';
    }
  }

  onFileChange(files: any, i) {
    this.formArray.controls[i].patchValue({ file: files[0] });
  }

  addDocument() {
    this.formArray.push(this.initDocument());
  }

  deleteDocument(i) {
    if (this.formArray.controls.length > 1)
      this.formArray.removeAt(i);
  }

}
