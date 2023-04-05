import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/ListResponseModel';
import { CompanyModel } from '../models/companyModel';
import { ResponseModel } from '../models/responseModel';
import { CompanyDto } from '../models/dtos/companyDto';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient
  ) { }

  getCompanyByUserId(userId: string): Observable<ListResponseModel<CompanyModel>> {
    let api = this.apiUrl + "company/getCompanyByUserId?userId=" + userId;
    return this.httpClient.get<ListResponseModel<CompanyModel>>(api);
  }

  companyChangeStatus(company: CompanyModel): Observable<ResponseModel> {
    let api = this.apiUrl + "company/companyChangeStatus";
    return this.httpClient.post<ResponseModel>(api, company);
  }

  add(companyDto: CompanyDto): Observable<ResponseModel> {
    let api = this.apiUrl + "company/addCompanyAndUser";
    return this.httpClient.post<ResponseModel>(api, companyDto);
  }

  getByCompanyId(companyId: number): Observable<SingleResponseModel<CompanyModel>> {
    let api = this.apiUrl + "company/getById?companyId=" + companyId;
    return this.httpClient.get<SingleResponseModel<CompanyModel>>(api);
  }

  updateCompany(company: CompanyModel): Observable<ResponseModel> {
    let api = this.apiUrl + "company/updateCompany";
    return this.httpClient.put<ResponseModel>(api, company);
  }

}
