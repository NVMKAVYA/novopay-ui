import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() parentform : FormGroup;
  @Input() name: string;
  @Input() labelname: string;
  @Input() required : boolean;
  @Input() submitted: boolean;
  @Input() options : any;
  @Input() optionvalue : any;
  @Input() showfield : any;
  @Input() displayfield : any;
  @Input() elementClass :any;
  @Input() value : any;
  @Output() valuechange = new EventEmitter();
  @Input() emitEvent : boolean;

  constructor(private fb: FormBuilder, private form : FormService) { }

  ngOnInit(): void {
    this.displayfield = this.displayfield ? this.displayfield : 'name';
    this.showfield = this.showfield !== undefined  ? this.showfield : true;
    this.elementClass = this.elementClass ? parseInt(this.elementClass) : 4;

    this.parentform.addControl(this.name ,this.fb.control(this.value, [ 
      this.form.conditionalValidator(this.required, Validators.required)]));

    if(this.emitEvent){
      this.parentform.controls[this.name].valueChanges.subscribe(() => { 
        this.valuechange.emit(this.parentform.controls[this.name].value);
      })
    }
  }

}
