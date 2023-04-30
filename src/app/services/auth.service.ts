import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { LoginModel } from '../models/loginModel';
import { RegisterDto } from '../models/dtos/registerDto';
import { TermsAndConditions } from '../models/termsAndConditions';
import { ResponseModel } from '../models/responseModel';
import { ChangePasswordDto } from '../models/dtos/changePasswordDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public redirectUrl: string;
  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient) {
  }

  register(registerDto: RegisterDto) {
    let api = this.apiUrl + "auth/register";
    return this.httpClient.post<SingleResponseModel<TokenModel>>(api, registerDto);
  }

  login(LoginModel: LoginModel) {
    let api = this.apiUrl + "auth/login";
    return this.httpClient.post<SingleResponseModel<TokenModel>>(api, LoginModel);
  }

  isAuthenticated() {
    if (localStorage.getItem("token")) {
      return true;
    }
    else {
      return false;
    }
  }

  getTermsAndConditions() {
    let api = this.apiUrl + "termsandcondition/get";
    return this.httpClient.get<SingleResponseModel<TermsAndConditions>>(api);
  }

  sendEmailConfirm(email: string) {
    let api = this.apiUrl + "auth/SendConfirmEmail?email=" + email;
    return this.httpClient.get<ResponseModel>(api);
  }

  confirmUser(value: string) {
    let api = this.apiUrl + "auth/confirmuser?value=" + value;
    return this.httpClient.get<ResponseModel>(api);
  }

  sendForgotPasswordEmail(email: string) {
    let api = this.apiUrl + "auth/forgotPassword?email=" + email;
    return this.httpClient.get<ResponseModel>(api);
  }

  forgotPasswordLinkCheck(value: string) {
    let api = this.apiUrl + "auth/forgotPasswordLinkCheck?value=" + value;
    return this.httpClient.get(api);
  }

  changePasswordToForgotPassword(changePasswordDto: ChangePasswordDto) {
    let api = this.apiUrl + "auth/ChangePasswordToForgotPassword";
    return this.httpClient.post<ResponseModel>(api, changePasswordDto);
  }

  changeCompany(userId: string, companyId: number) :Observable<SingleResponseModel<TokenModel>>{
    let api = this.apiUrl + "auth/changeCompany?userId=" + userId + "&companyId=" + companyId;
    return this.httpClient.get<SingleResponseModel<TokenModel>>(api);
  }
}
