import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserOperationClaim } from 'src/app/models/userOperationClaimModel';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyAccountService } from 'src/app/services/currency-account.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService();
  isAuthenticated: boolean;
  name: string = "";
  companyName: string = "";
  currentUrl: string = ""

  companyId: string;
  userId: string;


  // Yetkiler
  currencyAccount: boolean = false;
  user: boolean = false;
  company: boolean = false;
  mailParameter: boolean = false;
  mailTemplate: boolean = false;
  accountReconciliation: boolean = false;
  baBsReconciliation: boolean = false;

  userOperationClaim: UserOperationClaim[] = [];

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private userOperationClaimService: UserOperationClaimService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.refresh();
    this.userOperationClaimGetList();
  }

  refresh() {
    if (this.isAuthenticated) {
      let token = localStorage.getItem("token");
      let decode = this.jwtHelper.decodeToken(token);
      let name = Object.keys(decode).filter(x => x.endsWith("/name"))[0];
      this.name = decode[name];
      let companyId = Object.keys(decode).filter(c => c.endsWith('/anonymous'))[0];
      let userId = Object.keys(decode).filter(c => c.endsWith('/nameidentifier'))[0];
      this.companyId = decode[companyId];
      this.userId = decode[userId];
    }

  }

  logout() {
    localStorage.removeItem("token");
    this.toastr.warning("Başarılı bir şekilde çıkış yaptınız");
    this.router.navigate(["/login"]);
    this.isAuthenticated = false;
  }

  changeClass(url: string) {
    this.currentUrl = this.router.routerState.snapshot.url;
    if (url == this.currentUrl) {
      return "nav-link text-white active bg-gradient-primary";
    }
    else {
      return "nav-link text-white";
    }
  }

  userOperationClaimGetList() {
    this.spinner.show();
    this.userOperationClaimService.getListDto(this.userId, this.companyId).subscribe((res) => {
      this.userOperationClaim = res.data;
      console.log(this.userOperationClaim);
      this.userOperationClaim.forEach(elemet => {
        if (elemet.operationName == "Admin") {
          this.currencyAccount = true;
          this.company = true;
          this.user = true;
          this.mailParameter = true;
          this.mailTemplate = true;
          this.accountReconciliation = true;
          this.baBsReconciliation = true;
        }
        if (elemet.operationName == "CurrencyAccount") {
          this.currencyAccount = true;
        }
        if (elemet.operationName == "Company") {
          this.company = true;
        }
        if (elemet.operationName == "User") {
          this.user = true;
        }
        if (elemet.operationName == "MailParameter") {
          this.mailParameter = true;
        }
        if (elemet.operationName == "MailTemplate") {
          this.mailTemplate = true;
        }
        if (elemet.operationName == "AccountReconcilation") {
          this.accountReconciliation = true;
        }
        if (elemet.operationName == "BaBsReconciliation") {
          this.baBsReconciliation = true;
        }
      })
    }, (err) => {
      console.log(err.error);
    })
  }

}

// nav-link text-white active bg-gradient-primary
