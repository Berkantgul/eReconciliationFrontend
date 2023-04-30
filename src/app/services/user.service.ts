import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationClaimListForUserDto } from '../models/dtos/operationClaimListForUserDto';
import { UserReletionShipDto } from '../models/dtos/userReletionShipDto';
import { UserSecondRegisterDto } from '../models/dtos/userSecondRegisterDto';
import { ListResponseModel } from '../models/ListResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { UserDto } from '../models/userDto';
import { AdminCompaniesForUserDto } from '../models/dtos/adminCompaniesForUserDto';
import { CompanyModel } from '../models/companyModel';
import { UserThemeModel } from '../models/userThemeModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient
  ) { }

  getListUser(companyId: number): Observable<ListResponseModel<UserDto>> {
    let api = this.apiUrl + "User/GetUserList?companyId=" + companyId;
    return this.httpClient.get<ListResponseModel<UserDto>>(api);
  }

  getById(id: number): Observable<SingleResponseModel<UserDto>> {
    let api = this.apiUrl + "User/getById?id=" + id;
    return this.httpClient.get<SingleResponseModel<UserDto>>(api);
  }

  register(registerDto: UserSecondRegisterDto) {
    let api = this.apiUrl + "auth/RegisterSecondAccount";
    return this.httpClient.post<SingleResponseModel<TokenModel>>(api, registerDto);
  }

  update(registerDto: UserSecondRegisterDto) {
    let api = this.apiUrl + "user/update";
    return this.httpClient.post<SingleResponseModel<TokenModel>>(api, registerDto);
  }

  changeStatus(id: number): Observable<ResponseModel> {
    let api = this.apiUrl + "user/changeStatus?id=" + id;
    return this.httpClient.get<ResponseModel>(api);
  }

  getUserOperationClaims(value: string, companyId: string): Observable<ListResponseModel<OperationClaimListForUserDto>> {
    let api = this.apiUrl + "user/getOperationClaimList?value=" + value + "&companyId=" + companyId;
    return this.httpClient.get<ListResponseModel<OperationClaimListForUserDto>>(api);
  }

  updateOperationClaim(operationClaim: OperationClaimListForUserDto): Observable<ResponseModel> {
    let api = this.apiUrl + "user/updateOperationClaim";
    return this.httpClient.post<ResponseModel>(api, operationClaim);
  }

  getAdminUsersList(adminUserId: string): Observable<ListResponseModel<UserReletionShipDto>> {
    let api = this.apiUrl + "User/getAdminUsersList?adminUserId=" + adminUserId;
    return this.httpClient.get<ListResponseModel<UserReletionShipDto>>(api);
  }

  getUserCompanyList(userId: number): Observable<SingleResponseModel<UserReletionShipDto>> {
    let api = this.apiUrl + "User/getUserCompanyList?userId=" + userId;
    return this.httpClient.get<SingleResponseModel<UserReletionShipDto>>(api);
  }

  getListUserCompany(value: string): Observable<ListResponseModel<CompanyModel>> {
    let api = this.apiUrl + "User/getListUserCompany?value=" + value;
    return this.httpClient.get<ListResponseModel<CompanyModel>>(api);
  }

  userCompanyDelete(userId: number, companyId: number): Observable<ResponseModel> {
    let api = this.apiUrl + "user/userCompanyDelete?userId=" + userId + "&companyId=" + companyId;
    return this.httpClient.get<ResponseModel>(api);
  }

  userDelete(userId: number): Observable<ResponseModel> {
    let api = this.apiUrl + "user/userDelete?userId=" + userId;
    return this.httpClient.get<ResponseModel>(api);
  }

  getAdminCompaniesForUser(adminUserId: string, userUserId: number): Observable<ListResponseModel<AdminCompaniesForUserDto>> {
    let api = this.apiUrl + "User/getAdminCompaniesForUser?adminUserId=" + adminUserId + "&userUserId=" + userUserId;
    return this.httpClient.get<ListResponseModel<AdminCompaniesForUserDto>>(api);
  }

  addUserCompany(userId: number, companyId: number): Observable<ResponseModel> {
    let api = this.apiUrl + "user/addUserCompany?userId=" + userId + "&companyId=" + companyId;
    return this.httpClient.get<ResponseModel>(api);
  }

  getUserTheme(userId: string): Observable<SingleResponseModel<UserThemeModel>> {
    let api = this.apiUrl + "user/getUserTheme?userId=" + userId;
    return this.httpClient.get<SingleResponseModel<UserThemeModel>>(api);
  }

  changeTheme(userTheme: UserThemeModel): Observable<ResponseModel> {
    let api = this.apiUrl + "user/changeTheme";
    return this.httpClient.post<ResponseModel>(api, userTheme);
  }

}
