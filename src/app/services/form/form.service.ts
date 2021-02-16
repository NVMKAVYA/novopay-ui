import { Injectable } from '@angular/core';

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
  
}
