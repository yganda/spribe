import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckUserResponseData, SubmitFormResponseData } from '../interface/responses';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

constructor(private http: HttpClient) { }

  checkUsername(value: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', {username: value})
  }

  submitForm(value: any): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', value)
  }

}
