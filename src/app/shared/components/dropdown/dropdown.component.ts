import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() parentform: FormGroup;
  @Input() name: string;
  @Input() labelname: string;
  @Input() required: boolean;
  @Input() submitted: boolean;
  @Input() options: any;
  @Input() optionvalue: any;
  @Input() displayfield: any;
  @Input() elementClass: any;
  @Input() value: any;
  @Output() valuechange = new EventEmitter();
  @Input() emitEvent: boolean;

  private _showfield: boolean;

  @Input() set showfield(value: boolean) {
    this._showfield = value !== undefined ? value : true;
    if (value) {
      this.addField()
    } else {
      this.parentform.removeControl(this.name);
    }
  }

  get showfield() {
    return this._showfield;
  }

  private _disabled: boolean;

  @Input() set disabled(value: boolean) {
    this._disabled = value !== undefined ? value : false;
    if (value) {
      this.parentform.get(this.name)?.disable();
    } else {
      this.parentform.get(this.name)?.enable()
    }
  }

  get disabled() {
    return this._disabled;
  }

  constructor(private fb: FormBuilder, private form: FormService) { }

  ngOnInit(): void {
    this.displayfield = this.displayfield ? this.displayfield : 'name';
    this._showfield = this._showfield !== undefined ? this._showfield : true;
    this._disabled = this._disabled !== undefined ? this._disabled : false;
    this.elementClass = this.elementClass ? parseInt(this.elementClass) : 4;

    if (this._showfield) {
      this.addField()
    }

    if (this._disabled) {
      this.parentform.get(this.name).disable();
    }
  }

  addField() {
    this.parentform.addControl(this.name, this.fb.control(this.value, [
      this.form.conditionalValidator(this.required, Validators.required)]));
  }

  change() {
    if (this.emitEvent) {
      this.valuechange.emit(this.parentform.controls[this.name].value);
    }
  }

}
