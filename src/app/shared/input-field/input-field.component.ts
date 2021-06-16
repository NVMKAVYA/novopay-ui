import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form/form.service';

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
  @Input() maxlength: number;
  @Input() submitted: boolean;
  @Input() pattern: string;
  @Input() patternerror : string;
  @Input() showfield : any;
  @Input() elementClass :any;
  @Output() valuechange = new EventEmitter();
  @Input() emitEvent : boolean;

  constructor(private fb: FormBuilder, private form : FormService) { }

  ngOnInit(): void {
    this.showfield = this.showfield !== undefined  ? this.showfield : true;
    this.elementClass = this.elementClass ? parseInt(this.elementClass) : 4;

    this.parentform.addControl(this.name ,this.fb.control(null, [ 
      this.form.conditionalValidator(this.required, Validators.required),
      this.form.conditionalValidator(this.maxlength, Validators.maxLength(this.maxlength)),
      this.form.conditionalValidator(this.pattern, Validators.pattern(this.pattern)) ]));

    if(this.emitEvent){
      this.parentform.controls[this.name].valueChanges.subscribe(() => { 
        this.valuechange.emit(this.parentform.controls[this.name].value);
      })
    }
  }

}
