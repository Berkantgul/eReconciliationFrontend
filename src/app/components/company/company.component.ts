import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CompanyModel } from 'src/app/models/companyModel';
import { UserOperationClaim } from 'src/app/models/userOperationClaimModel';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService;
  companies: CompanyModel[] = []
  userOperationClaims: UserOperationClaim[] = []

  title: string = "Tüm Şirketler"
  allList: boolean = true
  activeList: boolean = false
  passiveList: boolean = false

  filterText: string
  searchString: string = ""

  companyId: string
  userId: string

  allListChecked: string
  activeListChecked: string
  passiveListChecked: string

  isAuthenticated: boolean = false

  operationAdd = false;
  operationUpdate = false;
  operationDelete = false;
  operationGet = false;
  operationList = false;

  // Forms
  addForm: FormGroup
  updateForm: FormGroup

  name: string = ""
  address: string = ""
  taxDepartment = ""
  taxIdNumber: string = ""
  identityNumber: string = ""

  company: CompanyModel

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private userOperationClaimService: UserOperationClaimService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe

  ) { }

  ngOnInit(): void {
    this.refresh()
    this.getCompanyByUserId()
    this.userOperationClaimGetList()
    this.createAddForm()
    this.createUpdateForm()
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

  exportExcel() {

  }

  getListByCheck(text: string) {
    if (text == "allList") {
      this.activeList = false;
      this.passiveList = false;
      this.allList = true;

      this.filterText = "";
      this.title = "Tüm şirketler"
      this.allListChecked = "checked";
      this.passiveListChecked = "";
      this.activeListChecked = "";

    } else if (text == "activeList") {
      this.allList = false;
      this.passiveList = false;
      this.activeList = true;

      this.filterText = "true";
      this.title = "Aktif Şirket Listesi"
      this.allListChecked = "";
      this.passiveListChecked = "";
      this.activeListChecked = "checked";

    } else if (text == "passiveList") {
      this.allList = false;
      this.activeList = false;
      this.passiveList = true;

      this.filterText = "false";
      this.title = "Pasif Şirket Listesi"
      this.allListChecked = "";
      this.passiveListChecked = "checked";
      this.activeListChecked = "";
    }
  }

  getCompanyByUserId() {
    this.spinner.show()
    this.companyService.getCompanyByUserId(this.userId).subscribe((res) => {
      this.spinner.hide()
      this.companies = res.data
    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık, daha sonra tekrar deneyin")
    })
  }

  userOperationClaimGetList() {
    this.spinner.show();
    this.userOperationClaimService.getListDto(this.userId.toString(), this.companyId).subscribe((res) => {
      this.userOperationClaims = res.data;
      this.userOperationClaims.forEach(element => {
        if (element.operationName == "Admin") {
          this.operationAdd = true;
          this.operationUpdate = true;
          this.operationDelete = true;
          this.operationGet = true;
          this.operationList = true;
        }

        if (element.operationName == "Company.Add") {
          this.operationAdd = true;
        }

        if (element.operationName == "Company.Update") {
          this.operationUpdate = true;
        }

        if (element.operationName == "Company.Delete") {
          this.operationDelete = true;
        }

        if (element.operationName == "Company.Get") {
          this.operationGet = true;
        }

        if (element.operationName == "Company.GetList") {
          this.operationList = true;
        }
      });

      this.spinner.hide();
    }, (err) => {
      this.toastr.error("Bir hata ile karşılaştık. Biraz sonra tekrar deneyin")
      //console.log(err)
      this.spinner.hide();
    })
  }

  changeStatus(company: CompanyModel) {
    this.spinner.show()
    this.companyService.companyChangeStatus(company).subscribe((res) => {
      this.spinner.hide()
      this.toastr.warning(res.message)
      this.getCompanyByUserId()

    }, (err) => {
      this.spinner.hide()
      this.toastr.error("Bir hata ile karşılaştık, daha sonra tekrar deneyin")
    })
  }

  createAddForm() {
    this.addForm = this.formBuilder.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      taxDepartment: ["", Validators.required],
      taxIdNumber: [""],
      identityNumber: [""],
      isActive: [true],
      addedAt: [this.datePipe.transform(Date(), 'yyyy-MM-dd')],
      userId: [this.userId]
    });
  }

  createUpdateForm() {
    this.updateForm = this.formBuilder.group({
      id: [0, Validators.required],
      name: ["", Validators.required],
      address: ["", Validators.required],
      taxDepartment: ["", Validators.required],
      taxIdNumber: [""],
      identityNumber: [""]
    })
  }

  getCompany(companyId: number) {
    this.spinner.show()
    this.companyService.getByCompanyId(companyId).subscribe((res) => {
      this.spinner.hide()
      this.company = res.data
      this.updateForm.controls["id"].setValue(res.data.id)
      this.updateForm.controls["name"].setValue(res.data.name)
      this.updateForm.controls["address"].setValue(res.data.address)
      this.updateForm.controls["taxDepartment"].setValue(res.data.taxDepartment)
      this.updateForm.controls["taxIdNumber"].setValue(res.data.taxIdNumber)
      this.updateForm.controls["identityNumber"].setValue(res.data.identityNumber)
    },(err)=>{

    })
  }

  add() {
    if (this.addForm.valid) {
      let companyModel = Object.assign({}, this.addForm.value);
      this.spinner.show();
      this.companyService.add(companyModel).subscribe((res) => {
        this.spinner.hide();
        this.toastr.success(res.message);
        this.getCompanyByUserId();
        this.createAddForm();
        document.getElementById("closeModal").click();
      }, (err) => {
        //console.log(err);
        this.toastr.error(err.error)
        this.spinner.hide();
      })
    } else {
      this.toastr.error("Beklenemedik bir hata oluştu");
    }
  }

  update() {
    if (this.updateForm.valid) {
      let company = Object.assign({}, this.updateForm.value)
      this.spinner.show()

      this.companyService.updateCompany(company).subscribe((res)=>{
        this.spinner.hide()
        this.toastr.info(res.message)
        this.getCompanyByUserId()
        this.createUpdateForm()
      })


    }
  }

  styleInputChange(text: string) {
    if (text != "") {
      return "input-group input-group-outline is-valid my-3";
    } else {
      return "input-group input-group-outline is-invalid my-3";
    }
  }
}
