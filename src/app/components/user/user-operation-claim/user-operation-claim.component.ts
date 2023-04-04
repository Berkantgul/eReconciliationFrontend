import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CompanyModel } from 'src/app/models/companyModel';
import { OperationClaimListForUserDto } from 'src/app/models/dtos/operationClaimListForUserDto';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-operation-claim',
  templateUrl: './user-operation-claim.component.html',
  styleUrls: ['./user-operation-claim.component.scss']
})
export class UserOperationClaimComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService
  userOperationClaims: OperationClaimListForUserDto[] = []
  companies: CompanyModel[] = []

  title: string = ""
  searchString: string = ""
  isAuthenticated: boolean = false

  companyId: string
  userId: string
  value: string
  selectForm: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.refresh()
    this.activatedRoute.params.subscribe(p => {
      this.value = p["value"];
      this.getUserOperationClaim(p["value"], this.companyId)
      this.getUserCompanyList(p["value"])
    })
  }

  refresh() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      let token = localStorage.getItem("token");
      let decode = this.jwtHelper.decodeToken(token);
      let companyId = Object.keys(decode).filter(x => x.endsWith("/anonymous"))[0];
      let userId = Object.keys(decode).filter(x => x.endsWith("/nameidentifier"))[0];
      this.companyId = decode[companyId];
      this.userId = decode[userId];
    }
  }

  getUserOperationClaim(value: string, companyId: string) {
    this.spinner.show()
    this.userService.getUserOperationClaims(value, companyId).subscribe((res) => {
      this.spinner.hide()
      this.userOperationClaims = res.data
      this.title = res.data[0].userName
      // console.log(this.userOperationClaims)
    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık. Biraz sonra tekrar deneyin.")
    })
  }

  updateOperationClaim(operationClaim: OperationClaimListForUserDto) {
    this.spinner.show()
    this.userService.updateOperationClaim(operationClaim).subscribe((res) => {
      this.spinner.hide()
      this.toastr.warning(res.message, "Başarılı")
      this.getUserOperationClaim(this.value, operationClaim.companyId.toString());
    }, (err) => {
      this.spinner.hide()
      this.toastr.error(err.error)
    })
  }

  getUserCompanyList(value: string) {
    this.spinner.show()
    this.userService.getListUserCompany(value).subscribe((res) => {
      this.spinner.hide()
      this.companies = res.data
    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık. Biraz sonra tekrar deneyin.")
    })
  }

  changeCompany(text:string) {
    console.log(text)
    this.getUserOperationClaim(this.value, this.selectForm);
  }



}
