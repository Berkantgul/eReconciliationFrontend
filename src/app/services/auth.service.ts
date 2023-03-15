import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { LoginModel } from '../models/loginModel';
import { RegisterDto } from '../models/dtos/registerDto';
import { TermsAndConditions } from '../models/termsAndConditions';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public redirectUrl: string;
  constructor(
    private httpClient: HttpClient) {
  }

  register(registerDto: RegisterDto) {
    let api = "https://localhost:7127/api/auth/register";
    return this.httpClient.post<SingleResponseModel<TokenModel>>(api, registerDto);
  }

  login(LoginModel: LoginModel) {
    let api = "https://localhost:7127/api/auth/login";
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
    let api = "https://localhost:7127/api/termsandcondition/get";
    return this.httpClient.get<SingleResponseModel<TermsAndConditions>>(api);
  }

  sendEmailConfirm(email: string) {
    let api = "https://localhost:7127/api/auth/SendConfirmEmail?email=" + email;
    return this.httpClient.get<ResponseModel>(api);
  }

  confirmUser(value: string) {
    let api = "https://localhost:7127/api/auth/confirmuser?value=" + value;
    return this.httpClient.get<ResponseModel>(api);
  }
}
