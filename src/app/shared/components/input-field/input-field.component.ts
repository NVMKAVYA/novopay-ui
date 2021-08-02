import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form/form.service';
import { Constants } from 'src/app/models/Constants';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {

  @Input() parentform : FormGroup;
  @Input() name: string;
  @Input() labelname: string;
  @Input() required : boolean;
  @Input() minlength: number;
  @Input() maxlength: number;
  @Input() mindate: number;
  @Input() submitted: boolean;
  @Input() pattern: string;
  @Input() patternerror : string;
  @Input() type : string;
  @Input() date : boolean;
  @Input() value : boolean;
  @Input() maxdate : any;
  @Input() labelclass : any;
  @Input() inputclass : any;
  @Input() placeholder : string;
  @Output() valuechange = new EventEmitter();
  @Input() emitEvent : boolean;
  datePickerConfig = {
    format: Constants.datePickerFormat,
    max : ''
  }
  private _showfield: boolean;
    
  @Input() set showfield(value: boolean) {
       this._showfield = value !== undefined ? value : true;
       if(value){
         this.addField()
       }else{
        this.parentform.removeControl(this.name);
       }
  }
  get showfield() {
    return this._showfield;
  }

  constructor(private fb: FormBuilder, private form : FormService) { }

  ngOnInit(): void {
    this._showfield = this._showfield  !== undefined ? this._showfield : true;
    this.labelclass = this.labelclass || 'col-sm-4';
    this.inputclass = this.inputclass || 'col-sm-6';
    this.type = this.type || 'text';

    if(this.type == 'date'){
      this.datePickerConfig.max = this.maxdate;
    }

    if(this._showfield){
      this.addField()
    }
  }

  addField() {
    this.parentform.addControl(this.name ,this.fb.control(this.value, [ 
      this.form.conditionalValidator(this.required, Validators.required),
      this.form.conditionalValidator(this.minlength, Validators.minLength(this.minlength)),
      this.form.conditionalValidator(this.maxlength, Validators.maxLength(this.maxlength)),
      this.form.conditionalValidator(this.pattern, Validators.pattern(this.pattern)) ]));
  }

  change(){
    if(this.emitEvent){
     this.valuechange.emit(this.parentform.controls[this.name].value);
    }
  }

}
