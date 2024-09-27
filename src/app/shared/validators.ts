import { ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { Country } from "./enum/country";
import { Observable, map } from "rxjs";
import { CheckUserResponseData } from "./interface/responses";

export function countryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = !Object.values(Country).includes(control.value);
    return forbidden ? {forbiddenCountry: {value: control.value}} : null;
  };
}

export function userNameValidator(apiService: any): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors|null> => {
    return apiService.checkUsername(control.value)
    .pipe(
      map((response: CheckUserResponseData) =>
        !response.isAvailable ? {forbiddenUserName: {value: control.value}} : null
    ));
  };
}
