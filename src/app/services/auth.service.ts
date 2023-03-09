import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { LoginModel } from '../models/loginModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public redirectUrl: string;
  constructor(
    private httpClient: HttpClient) {
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
}
