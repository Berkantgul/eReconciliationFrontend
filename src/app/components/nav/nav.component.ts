import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CompanyModel } from 'src/app/models/companyModel';
import { UserThemeModel } from 'src/app/models/userThemeModel';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isAuthenticated: boolean = false
  jwtHelper: JwtHelperService = new JwtHelperService

  companyId: string
  userId: string
  companyName: string
  styleClass = "";

  userThemeOption: UserThemeModel = {
    id: 0,
    sidenavColor: "primary",
    sidenavType: "dark",
    userId: 0
  }

  updateForm: FormGroup

  name: string = ""
  email: string = ""
  password: string = ""

  companies: CompanyModel[] = []
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private companyService: CompanyService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.refresh()
    this.getUserCompanyList()
    this.getUserTHeme()
    this.createUpdateForm()
  }

  refresh() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {

      let token = localStorage.getItem("token");
      let decode = this.jwtHelper.decodeToken(token);
      let companyId = Object.keys(decode).filter(c => c.endsWith('/anonymous'))[0];
      let userId = Object.keys(decode).filter(c => c.endsWith('/nameidentifier'))[0];
      let companyName = Object.keys(decode).filter(c => c.endsWith('/ispersistent'))[0];
      this.companyId = decode[companyId];
      this.userId = decode[userId];
      this.companyName = decode[companyName];
    }
  }

  getUserCompanyList() {
    this.spinner.show()
    this.companyService.getCompanyByUserId(this.userId).subscribe((res) => {
      this.spinner.hide()
      this.companies = res.data
      console.log(this.companies)
    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık daha sonra tekrar deneyin")
    })
  }


  getUserTHeme() {
    this.spinner.show()
    this.userService.getUserTheme(this.userId).subscribe((res) => {
      this.spinner.hide()
      this.userThemeOption = res.data

    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık daha sonra tekrar deneyin")
    })
  }
  changeCompany(companyId: number) {
    this.spinner.show()
    this.authService.changeCompany(this.userId, companyId).subscribe((res) => {
      localStorage.removeItem("token")
      this.spinner.hide()
      localStorage.setItem("token", res.data.token);
      this.toastr.info("Şirket başarıyla değiştirildi")
      window.location.reload();
    }, (err) => {
      this.spinner.hide()
      this.toastr.error(err.error, "Hata!");
    })
  }

  createUpdateForm() {
    this.updateForm = this.formBuilder.group({
      id: [0],
      email: ["", Validators.required],
      name: ["", Validators.required],
      password: [""]
    })
  }

  getById(id: string) {
    this.spinner.show();
    let userId = Number(id)
    // console.log(id)
    this.userService.getById(userId).subscribe((res) => {
      this.spinner.hide();
      this.updateForm.controls["id"].setValue(res.data.id);
      this.updateForm.controls["name"].setValue(res.data.name);
      this.updateForm.controls["email"].setValue(res.data.email);

    })
  }

  styleInputChange(text: string) {
    if (text != "") {
      return "input-group input-group-outline is-valid my-3";
    } else {
      return "input-group input-group-outline is-invalid my-3";
    }
  }

  updateUser() {
    this.spinner.show();

    if (this.updateForm.valid) {
      let userUpdateModel = Object.assign({}, this.updateForm.value);
      this.userService.update(userUpdateModel).subscribe((res) => {
        this.spinner.hide();
        this.toastr.warning(res.message, "Güncellendi");
        this.createUpdateForm();
        document.getElementById("closeUpdateModal").click();
      }, (err) => {
        this.spinner.hide();
        this.toastr.error(err.error, "Hata")
      })
    } else {
      this.spinner.hide();
      this.toastr.error("Gerekli alanları doldurun!")
    }
  }

  // setting button
  changeStyleClass(deneme: string) {
    return "fixed-plugin ps " + deneme;
  }

  changeSidenavColor(color: string) {
    this.userThemeOption.sidenavColor = color
    this.changeTheme()
  }

  changeSidenavType(color: string) {
    this.userThemeOption.sidenavType = color
    this.changeTheme()
  }

  changeTheme() {
    this.spinner.show()
    this.userService.changeTheme(this.userThemeOption).subscribe((res) => {
      this.spinner.hide()
      this.toastr.success(res.message)
    }, (err) => {
      this.spinner.hide()
      this.toastr.error(err.error)
    })
  }

  logout() {
    localStorage.removeItem("token");
    this.toastr.warning("Başarılı bir şekilde çıkış yaptınız");
    this.router.navigate(["/login"]);
    this.isAuthenticated = false;
  }

}
