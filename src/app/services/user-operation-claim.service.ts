import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/ListResponseModel';
import { UserOperationClaim } from '../models/userOperationClaimModel';

@Injectable({
  providedIn: 'root'
})
export class UserOperationClaimService {

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient
  ) { }

  getListDto(userId: string, companyId: string): Observable<ListResponseModel<UserOperationClaim>> {
    let api = this.apiUrl + "UserOperationClaim/getListDto?userId=" + userId + "&companyId=" + companyId;
    return this.httpClient.get<ListResponseModel<UserOperationClaim>>(api);
  }


}
