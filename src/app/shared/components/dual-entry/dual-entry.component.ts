import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'dual-entry',
  templateUrl: './dual-entry.component.html',
  styleUrls: ['./dual-entry.component.css'],
  providers: [

  ]
})
export class DualEntryComponent implements OnInit {
  @Input() parentform: FormGroup;
  @Input() elementclass: any;
  @Input() type: string;
  @Input() name: string;
  @Input() labelname: string;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() maxlength: number;
  @Input() pattern: string;
  @Input() patternerror: string;
  @Input() submitted: boolean;
  @Input() mininput: number;
  @Input() maxinput: number;
  @Input() options: any;
  @Input() optionvalue: string;
  @Output() valuechange = new EventEmitter();
  @Input() emitEvent: boolean;
  @Input() value: any;

  dualname: string;
  dualForm: FormGroup;

  private _showfield: boolean;

  @Input() set showfield(value: boolean) {
    this._showfield = value !== undefined ? value : true;
    if (value) {
      this.elementclass = parseInt(this.elementclass);
      this.dualname = 'confirm' + this.name;
      this.addField()
    } else {
      this.parentform.removeControl(this.name);
      this.dualForm.removeControl(this.dualname);
    }
  }

  get showfield() {
    return this._showfield;
  }


  constructor(private fb: FormBuilder, private form: FormService) { }

  ngOnInit(): void {
    this.elementclass = parseInt(this.elementclass);
    this.dualname = 'confirm' + this.name;
    if (this._showfield == undefined) {
      this._showfield = this._showfield !== undefined ? this._showfield : true;
      this.addField()
    }
  }

  addField() {
    this.parentform.addControl(this.name, this.fb.control(this.value, [
      this.form.conditionalValidator(this.required, Validators.required),
      this.form.conditionalValidator(this.maxlength, Validators.maxLength(this.maxlength)),
      this.form.conditionalValidator(this.pattern, Validators.pattern(this.pattern)),
      this.form.conditionalValidator((this.mininput || this.maxinput) && this.labelname == 'Date of Birth', this.ageLimit()),
      this.form.conditionalValidator(this.labelname == 'Mobile Number', this.validatePhoneNumber())]));

    this.dualForm = this.fb.group({});

    this.dualForm.addControl(this.dualname, this.fb.control(this.value, [
      this.form.conditionalValidator(this.required, Validators.required),
      this.form.mustMatch(this.name, this.parentform)]));
    this.dualForm.controls[this.dualname].disable();

    this.parentform.controls[this.name].valueChanges.subscribe(() => {
      if (this.parentform.controls[this.name].value) {
        this.dualForm.controls[this.dualname].enable();
        if (this.emitEvent)
          this.valuechange.emit(this.parentform.controls[this.name].value);
      } else {
        this.dualForm.controls[this.dualname].disable();
      }
    })
  }

  ageLimit(): ValidatorFn {
    return (matchingControl: AbstractControl): { [key: string]: any } | null => {

      if (matchingControl.value) {
        let dsplit = matchingControl.value.split("/");
        function padToTwo(number) {
          if (number <= 9) { number = ("0" + number).slice(-2); }
          return number.toString();
        }
        dsplit[0] = padToTwo(parseInt(dsplit[0]));
        dsplit[1] = padToTwo(parseInt(dsplit[1]));
        if (dsplit.length == 3) {
          if (parseInt(dsplit[1]) > 12 || parseInt(dsplit[1]) < 1 || parseInt(dsplit[0].length) != 2 || parseInt(dsplit[1].length) != 2 || parseInt(dsplit[2].length) != 4) {
            return { invalidDate: true }
          }
        } else {
          return { invalidDate: true }
        }
        let date = new Date(parseInt(dsplit[2]), parseInt(dsplit[1]) - 1, parseInt(dsplit[0]));
        let minDate = new Date();
        minDate.setHours(0, 0, 0, 0);
        minDate = new Date(minDate.setFullYear(minDate.getFullYear() - (this.maxinput || 200)));
        let maxDate = new Date();
        maxDate.setHours(0, 0, 0, 0);
        maxDate = new Date(maxDate.setFullYear(maxDate.getFullYear() - (this.mininput || 0)));

        if ((date <= maxDate) && (date >= minDate)) {
          return null;
        } else {
          return { ageLimit: true };
        }
      } else {
        return null;
      }
    }
  }

  validatePhoneNumber(): ValidatorFn {
    return (matchingControl: AbstractControl): { [key: string]: any } | null => {

      if ((matchingControl.value && matchingControl.value.length < 10)) {
        return { invalidPhonenumber: true };
      } else {
        if (!matchingControl.value) {
          return null;
        }
        let regex = /^[0-9]+$/;
        if (!regex.test(matchingControl.value)) {
          return { invalidPhonenumber: true };
        }
        let validStartDigit = [6, 7, 8, 9];
        if (validStartDigit.indexOf(parseInt(matchingControl.value.substr(0, 1))) < 0) {
          return { invalidPhonenumber: true };
        }
        let blackList = [
          6666666666,
          7777777777,
          8888888888,
          9999999999,
          9876543210
        ];
        if (blackList.indexOf(parseInt(matchingControl.value)) > -1) {
          return null;
        }
      }
    }
  }

}
