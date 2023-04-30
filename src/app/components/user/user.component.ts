import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminCompaniesForUserDto } from 'src/app/models/dtos/adminCompaniesForUserDto';
import { UserReletionShipDto } from 'src/app/models/dtos/userReletionShipDto';
import { UserSecondRegisterDto } from 'src/app/models/dtos/userSecondRegisterDto';
import { UserDto } from 'src/app/models/userDto';
import { UserThemeModel } from 'src/app/models/userThemeModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService;
  userList: UserDto[] = [];
  usersReletionShipDto: UserReletionShipDto[] = []
  adminCompaniesForUserDto: AdminCompaniesForUserDto[] = []
  userReletionShipDto: UserReletionShipDto
  isAuthenticated: boolean;

  selectCompany: number = 0
  searchString: string;
  companyId: number;
  userId: string;

  // slider button
  allList: boolean = true;
  activeList: boolean = false;
  passiveList: boolean = false;
  filterText: string = "";

  allListChecked: string = "";
  passiveListChecked: string = "";
  activeListChecked: string = "";

  // Title
  title: string = "Tüm Kullanıcı Listesi";

  // form element
  name: string = "";
  email: string = "";
  password: string = "";

  // User Add Form
  addForm: FormGroup
  updateForm: FormGroup

  userSecondRegisterDto: UserSecondRegisterDto

  // UserTheme
  userThemeOption: UserThemeModel = {
    id: 0,
    sidenavColor: "primary",
    sidenavType: "dark",
    userId: 0
  }

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.refresh()
    this.getListUser()
    this.createAddForm()
    this.createUpdateForm()
    this.getAdminUsersList()
    this.getUserTheme()
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

  getListUser() {
    this.spinner.show();
    this.userService.getListUser(this.companyId).subscribe((res) => {
      this.spinner.hide();
      this.userList = res.data;
      console.log(this.userList);
    }, (err) => {
      console.log(err);
    })
  }

  getListByCheck(text: string) {
    if (text == "allList") {
      this.activeList = false;
      this.passiveList = false;
      this.allList = true;

      this.filterText = "";
      this.title = "Tüm kullanıcılar"
      this.allListChecked = "checked";
      this.passiveListChecked = "";
      this.activeListChecked = "";

    } else if (text == "activeList") {
      this.allList = false;
      this.passiveList = false;
      this.activeList = true;

      this.filterText = "true";
      this.title = "Aktif kullanıcı liste"
      this.allListChecked = "";
      this.passiveListChecked = "";
      this.activeListChecked = "checked";

    } else if (text == "passiveList") {
      this.allList = false;
      this.activeList = false;
      this.passiveList = true;

      this.filterText = "false";
      this.title = "Pasif kullanıcı liste"
      this.allListChecked = "";
      this.passiveListChecked = "checked";
      this.activeListChecked = "";
    }
  }

  exportExcel() {

  }

  styleInputChange(text: string) {
    if (text != "") {
      return "input-group input-group-outline is-valid my-3";
    } else {
      return "input-group input-group-outline is-invalid my-3";
    }
  }

  createAddForm() {
    this.addForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", (Validators.required, Validators.email)],
      password: ["", Validators.required]
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


  getById(id: number) {
    this.spinner.show();
    // console.log(id)
    this.userService.getById(id).subscribe((res) => {
      this.spinner.hide();
      this.updateForm.controls["id"].setValue(res.data.id);
      this.updateForm.controls["name"].setValue(res.data.name);
      this.updateForm.controls["email"].setValue(res.data.email);
      console.log(res.data)
    })
  }


  addUser() {
    this.spinner.show();
    if (this.addForm.valid) {
      let userRegisterModel = Object.assign({}, this.addForm.value);

      this.userSecondRegisterDto = {
        name: userRegisterModel.name,
        email: userRegisterModel.email,
        password: userRegisterModel.password,
        companyId: this.companyId,
        adminUserId: this.userId
      };
      this.userService.register(this.userSecondRegisterDto).subscribe((res) => {
        this.spinner.hide();
        this.toastr.success(res.message);
        this.getAdminUsersList()
        this.createAddForm();
        document.getElementById("closeModal").click();
      }, (err) => {
        this.spinner.hide();
        this.toastr.error(err.error);
      })
    } else {
      this.spinner.hide();
      this.toastr.warning("Gerekli alanları doldurun", "Hata")
    }
  }

  updateUser() {
    this.spinner.show();

    if (this.updateForm.valid) {
      let userUpdateModel = Object.assign({}, this.updateForm.value);
      this.userService.update(userUpdateModel).subscribe((res) => {
        this.spinner.hide();
        this.toastr.warning(res.message, "Güncellendi");
        this.getAdminUsersList()
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

  changeStatus(id: number) {
    this.spinner.show()
    this.userService.changeStatus(id).subscribe((res) => {
      this.spinner.hide()
      this.toastr.info(res.message, "Bilgilendirme")
      this.getListUser()
    }, (err) => {
      this.spinner.hide()
      this.toastr.error(err.error, "Hata")
    })
  }

  getAdminUsersList() {
    this.spinner.show()
    this.userService.getAdminUsersList(this.userId).subscribe((res) => {
      this.spinner.hide()
      this.usersReletionShipDto = res.data
      console.log(this.userReletionShipDto)
    }, (err) => {
      console.log(err)
    })
  }

  getUserCompanyList(userId: number) {
    this.spinner.show()
    this.userService.getUserCompanyList(userId).subscribe((res) => {
      this.spinner.hide()
      this.adminCompaniesForUser(this.userId, userId)
      this.userReletionShipDto = res.data
    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık. Biraz sonra tekrar deneyin.")
    })
  }

  userCompanyDelete(userId: number, companyId: number) {
    this.spinner.show()
    this.userService.userCompanyDelete(userId, companyId).subscribe((res) => {
      this.spinner.hide()
      this.toastr.info(res.message, "Başarılı")
      this.getUserCompanyList(userId)
    }, (err) => {
      this.spinner.hide()
      this.toastr.error(err.error)
    })
  }

  userDelete(userId: number) {
    this.spinner.show()
    this.userService.userDelete(userId).subscribe((res) => {
      this.spinner.hide()
      this.toastr.info(res.message, "Başarılı")
      this.getUserCompanyList(userId)
    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık. Biraz sonra tekrar deneyin.")
    })
  }

  adminCompaniesForUser(adminUserId: string, userUserId: number) {
    this.spinner.show()
    this.userService.getAdminCompaniesForUser(adminUserId, userUserId).subscribe((res) => {
      this.spinner.hide()
      this.adminCompaniesForUserDto = res.data
    }, (err) => {
      this.spinner.hide()
      // this.toastr.error(err.error)
      console.log(err.error)
    })
  }

  addUserCompany(userId: number, companyId: number) {
    this.spinner.show()
    this.userService.addUserCompany(userId, companyId).subscribe((res) => {
      this.spinner.hide()
      this.toastr.info(res.message)
      this.getUserCompanyList(userId)
    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık. Biraz sonra tekrar deneyin.")
    })
  }

  getUserTheme() {
    this.spinner.show()
    this.userService.getUserTheme(this.userId).subscribe((res) => {
      this.spinner.hide()
      this.userThemeOption = res.data
    },(err)=>{
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık. Daha sonra tekrar deneyin")
    })
  }
}
