import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserOperationClaim } from 'src/app/models/userOperationClaimModel';
import { UserThemeModel } from 'src/app/models/userThemeModel';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyAccountService } from 'src/app/services/currency-account.service';
import { MailparameterService } from 'src/app/services/mailparameter.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserService } from 'src/app/services/user.service';

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

  // UserTheme
  userThemeOption: UserThemeModel = {
    id: 0,
    sidenavColor: "primary",
    sidenavType: "dark",
    userId: 0
  }

  userOperationClaim: UserOperationClaim[] = [];

  updateForm: FormGroup


  email: string = ""
  password: string = ""
  port: string = ""
  smtp: string = ""
  ssl: string = ""
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private userOperationClaimService: UserOperationClaimService,
    private userService: UserService,
    private mailParameterService: MailparameterService,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.refresh();
    this.userOperationClaimGetList();
    this.getUserTheme()
    this.createUpdateForm()
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

  getUserTheme() {
    this.spinner.show()
    this.userService.getUserTheme(this.userId).subscribe((res) => {
      this.spinner.hide()
      this.userThemeOption = res.data
    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık, Daha sonra tekrar deneyin.")
    })
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
      return "nav-link text-white active bg-gradient-" + this.userThemeOption.sidenavColor;
    }
    else {
      return "nav-link text-white";
    }
  }

  userOperationClaimGetList() {
    this.spinner.show();
    this.userOperationClaimService.getListDto(this.userId, this.companyId).subscribe((res) => {
      this.userOperationClaim = res.data;
      // console.log(this.userOperationClaim);
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
      // console.log(err.error);
    })
  }

  createUpdateForm() {
    this.updateForm = this.formBuilder.group({
      id: [0, Validators.required],
      email: ["", Validators.required],
      password: [""],
      companyId: [this.companyId, Validators.required],
      smtp: ["", Validators.required],
      port: [0, Validators.required],
      ssl: [false, Validators.required]
    })
  }

  getById() {
    this.spinner.show()
    this.mailParameterService.getById(this.companyId).subscribe((res) => {
      if (res.data != null) {
        this.updateForm.controls["id"].setValue(res.data.id)
        this.updateForm.controls["companyId"].setValue(res.data.companyId)
        this.updateForm.controls["email"].setValue(res.data.email)
        this.updateForm.controls["password"].setValue(res.data.password)
        this.updateForm.controls["smtp"].setValue(res.data.smtp)
        this.updateForm.controls["port"].setValue(res.data.port)
        this.updateForm.controls["ssl"].setValue(res.data.ssl)
      }
      this.spinner.hide()
      console.log(this.updateForm)
    })
  }

  styleInputChange(text: string) {
    if (text != "") {
      return "input-group input-group-outline is-valid my-3";
    } else {
      return "input-group input-group-outline is-invalid my-3";
    }
  }

  update() {
    this.spinner.show()
    if (this.updateForm.valid) {
      let mailParameter = Object.assign({}, this.updateForm.value);
      console.log(mailParameter)
      this.mailParameterService.update(mailParameter).subscribe((res) => {
        this.spinner.hide();
        this.toastr.warning(res.message, "Güncellendi");
        document.getElementById("closeMailParameterModal").click();
      }, (err) => {
        this.spinner.hide();
        this.toastr.error(err.error, "Hata")
      })
    } else {
      this.spinner.hide();
      this.toastr.error("Gerekli alanları doldurun!")
    }
  }
}

// nav-link text-white active bg-gradient-primary
