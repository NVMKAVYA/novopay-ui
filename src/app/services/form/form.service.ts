import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  public conditionalValidator(predicate, validator) {
    return (formControl => {

      if (predicate) {
        return validator(formControl); 
      }
      return null;
    })
  }

  mustMatch( controlName: string, parentform : FormGroup ): ValidatorFn {
    return (matchingControl: AbstractControl): { [key: string]: any } | null  =>{
        const control = parentform.controls[controlName];

        if (control.value !== matchingControl.value && control.value && matchingControl.value) {
          return { mustMatch : true };
        } else {
          return null;
        }
    }
  }

  
}
