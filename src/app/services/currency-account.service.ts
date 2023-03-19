import { HttpClient } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyAccount } from '../models/currencyAccount';
import { ListResponseModel } from '../models/ListResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CurrencyAccountService {

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient
  ) { }

  add(currencyAccount: CurrencyAccount): Observable<ResponseModel> {
    let api = this.apiUrl + "CurrencyAccount/Add";
    return this.httpClient.post<ResponseModel>(api, currencyAccount);
  }

  getList(companyId: string): Observable<ListResponseModel<CurrencyAccount>> {
    let api = "https://localhost:7127/api/currencyaccount/getlist?companyId=" + companyId;
    return this.httpClient.get<ListResponseModel<CurrencyAccount>>(api);
  }

  delete(currencyAccount: CurrencyAccount): Observable<ResponseModel> {
    let api = this.apiUrl + "CurrencyAccount/Delete";
    return this.httpClient.post<ResponseModel>(api, currencyAccount);
  }

  update(currencyAccount: CurrencyAccount): Observable<ResponseModel> {
    let api = this.apiUrl + "CurrencyAccount/Update";
    return this.httpClient.post<ResponseModel>(api, currencyAccount);
  }

  getbyid(id: number): Observable<SingleResponseModel<CurrencyAccount>> {
    let api = this.apiUrl + "CurrencyAccount/get?id=" + id;
    return this.httpClient.get<SingleResponseModel<CurrencyAccount>>(api);

  }

  addFromExcel(file: any, companyId: string): Observable<ResponseModel> {
    let api = this.apiUrl + "CurrencyAccount/AddFromExcel?companyId=" + companyId;

    const formData = new FormData;
    formData.append("file", file, file.name);
    return this.httpClient.post<ResponseModel>(api, formData);
  }

}
