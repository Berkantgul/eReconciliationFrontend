import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrencyAccount } from 'src/app/models/currencyAccount';
import { UserOperationClaim } from 'src/app/models/userOperationClaimModel';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyAccountService } from 'src/app/services/currency-account.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-currency-account',
  templateUrl: './currency-account.component.html',
  styleUrls: ['./currency-account.component.scss']
})
export class CurrencyAccountComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService();
  currencyAccounts: CurrencyAccount[] = [];
  userOperationClaim: UserOperationClaim[] = [];

  // Form
  addForm: FormGroup;
  updateForm: FormGroup;

  isAuthenticated: boolean;

  companyId: string;
  userId: string;

  searchString: string;
  currencyAccount: CurrencyAccount;
  passiveList: boolean = false;
  allList: boolean = true;
  activeList: boolean = false;
  allListChecked: string = "";
  activeListChecked: string = "";
  passiveListChecked: string = "";
  title: string = "Tüm cari liste";
  filterText: string = ""
  file: string;


  // ngmodel
  code: string = "";
  name: string = "";
  address: string = "";
  taxDepartment: string = "";
  taxIdNumber: string = "";
  identityNumber: string = "";
  email: string = "";
  authorized: string = "";

  constructor(
    private currencyAccountService: CurrencyAccountService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private userOperationClaimService: UserOperationClaimService
  ) { }

  ngOnInit(): void {
    this.refresh();
    this.getListUserOperationClaim();
    this.getList();
    this.createAddForm();
    this.createUpdateForm();
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

  getList() {
    this.currencyAccountService.getList(this.companyId).subscribe((res) => {
      this.currencyAccounts = res.data
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.toastr.error("Bir hatayla karşılaştık. Daha sonra tekrar güncelleyin.", "Hata")
    })
  }

  exportExcel() {
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, "CariListe.xlsx");
  }

  deleteCurrencyAccount(currencyAccount: CurrencyAccount) {
    this.spinner.show();
    this.currencyAccountService.delete(currencyAccount).subscribe((res) => {
      this.spinner.hide();
      this.getList();
      this.toastr.info(res.message, "Başarılı")
    }, (err) => {
      this.spinner.hide();
      this.toastr.error(err.error);
      console.log(err.error)
    })
  }

  currentCurrency(currencyAccount: CurrencyAccount) {
    this.currencyAccount = currencyAccount;
  }

  changeStatusCurrencyAccount(currencyAccount: CurrencyAccount) {
    currencyAccount.isActive ? currencyAccount.isActive = false : currencyAccount.isActive = true;
    this.spinner.show();
    this.currencyAccountService.update(currencyAccount).subscribe((res) => {
      this.spinner.hide();
      this.toastr.warning(res.message, "Başarılı")
    }, (err) => {
      this.spinner.hide();
      this.toastr.error(err.error);
      console.log(err.error)
    })
  }

  getListByCheck(text: string) {

    if (text == "allList") {
      this.activeList = false;
      this.passiveList = false;
      this.allList = true;

      this.filterText = "";
      this.title = "Tüm cari liste"
      this.allListChecked = "checked";
      this.passiveListChecked = "";
      this.activeListChecked = "";

    } else if (text == "activeList") {
      this.allList = false;
      this.passiveList = false;
      this.activeList = true;

      this.filterText = "true";
      this.title = "Aktif cari liste"
      this.allListChecked = "";
      this.passiveListChecked = "";
      this.activeListChecked = "checked";

    } else if (text == "passiveList") {
      this.allList = false;
      this.activeList = false;
      this.passiveList = true;

      this.filterText = "false";
      this.title = "Pasif cari liste"
      this.allListChecked = "";
      this.passiveListChecked = "checked";
      this.activeListChecked = "";
    }
  }

  createAddForm() {
    this.addForm = this.formBuilder.group({
      companyId: this.companyId,
      code: ["", Validators.required],
      name: ["", (Validators.required, Validators.minLength(3))],
      address: ["", (Validators.minLength(3), Validators.required)],
      taxDepartment: ["", Validators.required],
      taxIdNumber: [""],
      identityNumber: [""],
      email: [""],
      authorized: [""],
      addedAt: [this.datePipe.transform(Date(), 'yyyy-MM-dd')],
      isActive: true
    })
  }

  createUpdateForm() {
    this.updateForm = this.formBuilder.group({
      id: [0],
      companyId: this.companyId,
      code: ["", Validators.required],
      name: ["", (Validators.required, Validators.minLength(3))],
      address: ["", (Validators.minLength(3), Validators.required)],
      taxDepartment: ["", Validators.required],
      taxIdNumber: [""],
      identityNumber: [""],
      email: [""],
      authorized: [""],
      addedAt: [this.datePipe.transform(Date(), 'yyyy-MM-dd')],
      isActive: true
    })
  }

  addCurrencyAccount() {
    if (this.addForm.valid) {
      let currencyAccountModel = Object.assign({}, this.addForm.value);
      this.spinner.show();
      this.currencyAccountService.add(currencyAccountModel).subscribe((res) => {
        this.spinner.hide();
        this.toastr.success(res.message, "Başarılı");
        this.getList();
        this.createAddForm();
        document.getElementById("closeModal").click();
      }, (err) => {
        this.toastr.error(err.error);
        this.spinner.hide();
      })
    } else {
      this.toastr.error("Eksik alanları doldurun.", "Hata")
    }
  }

  updateCurrencyAccount() {
    if (this.updateForm.valid) {
      let currencyAccountModel = Object.assign({}, this.updateForm.value);
      this.spinner.show();
      this.currencyAccountService.update(currencyAccountModel).subscribe((res) => {
        this.spinner.hide();
        this.toastr.warning(res.message, "Güncellendi");
        this.getList();
        this.createUpdateForm();
        document.getElementById("closeUpdateFromModal").click();
      }, (err) => {
        this.spinner.hide();
        this.toastr.error(err.error, "Hata");
      })
    }
  }

  getCurrencyAccount(id: number) {
    this.spinner.show();
    this.currencyAccountService.getbyid(id).subscribe((res) => {
      this.spinner.hide();
      this.currencyAccount = res.data;
      console.log(this.currencyAccount)
      this.updateForm.controls['id'].setValue(res.data.id);
      this.updateForm.controls['companyId'].setValue(res.data.companyId);
      this.updateForm.controls['code'].setValue(res.data.code);
      this.updateForm.controls['name'].setValue(res.data.name);
      this.updateForm.controls['address'].setValue(res.data.address);
      this.updateForm.controls['taxDepartment'].setValue(res.data.taxDepartment);
      this.updateForm.controls['taxIdNumber'].setValue(res.data.taxIdNumber);
      this.updateForm.controls['identityNumber'].setValue(res.data.identityNumber);
      this.updateForm.controls['authorized'].setValue(res.data.authorized);
      //console.log(this.currencyAccount);
    }, (err) => {
      this.spinner.hide();
      this.toastr.error(err.error);
    })
  }

  styleInputChange(text: string) {
    if (text != "") {
      return "input-group input-group-outline is-valid my-3";
    } else {
      return "input-group input-group-outline is-invalid my-3";
    }
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  addFromExcelCurrencyAccount() {
    if (this.file != null && this.file != "") {
      this.spinner.show();
      this.currencyAccountService.addFromExcel(this.file, this.companyId).subscribe((res) => {
        this.spinner.hide();
        this.toastr.success(res.message, "Başarılı");
        this.getList();
        document.getElementById("closeExcelModal").click();
      }, (err) => {
        this.spinner.hide();
        // this.toastr.error(err.error);
        console.log(err)
      })
    } else {
      this.toastr.warning("Lütfen dosya türünde veri yükleyiniz");
    }
  }

  getListUserOperationClaim() {
    this.spinner.show();
    this.userOperationClaimService.getListDto(this.userId, this.companyId).subscribe((res) => {
      this.spinner.hide();
      console.log(res.data);
    }, (err) => {
      console.log(err.error);
    })
  }
}
