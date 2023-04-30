import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserThemeModel } from 'src/app/models/userThemeModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,


  ) { }
  ngOnInit(): void {
    this.refresh()
    this.getUserTheme()
  }
  jwtHelper: JwtHelperService = new JwtHelperService
  isAuthenticated: boolean = false
  styleClass = "";

  companyId: string
  userId: string

  // UserTheme
  userThemeOption: UserThemeModel = {
    id: 0,
    userId: 0,
    sidenavType: "dark",
    sidenavColor: "primary"
  }

  // setting button
  changeStyleClass(deneme: string) {
    return "fixed-plugin ps " + deneme;
  }

  refresh() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.spinner.show()
      let token = localStorage.getItem("token");
      let decode = this.jwtHelper.decodeToken(token);
      let companyId = Object.keys(decode).filter(c => c.endsWith('/anonymous'))[0];
      let userId = Object.keys(decode).filter(c => c.endsWith('/nameidentifier'))[0];
      this.companyId = decode[companyId];
      this.userId = decode[userId];
    }
  }

  getUserTheme() {
    this.spinner.show()
    this.userService.getUserTheme(this.userId).subscribe((res) => {
      this.spinner.hide()
      this.userThemeOption = res.data
    },(err)=>{
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık. Daha sonra tekrar deneyin.")
    })
  }

}
