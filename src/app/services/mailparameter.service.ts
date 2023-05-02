import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/singleResponseModel';
import { MailParameter } from '../models/mailParameterModel';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class MailparameterService {

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient
  ) { }

  getById(id: string): Observable<SingleResponseModel<MailParameter>> {
    let api = this.apiUrl + "MailParameter/GetById?id=" + id;
    return this.httpClient.get<SingleResponseModel<MailParameter>>(api);
  }

  update(mailParameter: MailParameter): Observable<ResponseModel> {
    let api = this.apiUrl + "MailParameter/Update";
    return this.httpClient.post<ResponseModel>(api, mailParameter);
  }
}
