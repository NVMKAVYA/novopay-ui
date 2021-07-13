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

  public mustMatch(controlName: string, parentform: FormGroup): ValidatorFn {
    return (matchingControl: AbstractControl): { [key: string]: any } | null => {
      const control = parentform.controls[controlName];

      if (control.value !== matchingControl.value && control.value && matchingControl.value) {
        return { mustMatch: true };
      } else {
        return null;
      }
    }
  }

  public calculateAge(dateOfBirth) {
    if (dateOfBirth) {
      var today = new Date();
      var birthDate = new Date(dateOfBirth);
      var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var oneDay = 1000 * 60 * 60 * 24;

      var nextBirthYear = birthDate.getFullYear() + 1;
      var preCurYear = todayDate.getFullYear() - 1;
      var diffYear = preCurYear - nextBirthYear + 1;
      if (diffYear < 1) {
        diffYear = 0;
      }

      var decBirthYear = new Date(birthDate.getFullYear(), 11, 31);
      var janBirthYear = new Date(todayDate.getFullYear(), 0, 1);

      var daysInMin1: any = decBirthYear.getTime() - birthDate.getTime();
      var days1 = daysInMin1 / oneDay;

      var daysInMin2 = todayDate.getTime() - janBirthYear.getTime();
      var days2 = daysInMin2 / oneDay;

      var days = days1 + days2;

      var moduleDays = days % (this.isLeapYear(today.getFullYear()) ? 366 : 365)

      if (days == moduleDays) {
        diffYear = diffYear + 1;
      } else {
        diffYear = diffYear + 2;
      }
      return diffYear;
    }
  }

  private isLeapYear = function (year) {
    var d = new Date(year, 1, 28);
    d.setDate(d.getDate() + 1);
    return d.getMonth() == 1;
  }


}
