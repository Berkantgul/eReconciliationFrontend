import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterDto } from 'src/app/models/dtos/registerDto';
import { TermsAndConditions } from 'src/app/models/termsAndConditions';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  registerDto: RegisterDto;
  isRegisterButtonActive: boolean = true;
  termsAndConditions: TermsAndConditions = { id: 0, description: "" };
  isFormComplete: boolean = false;

  isTermsAndConditionsChecked: boolean = false;

  email: string = "";
  name: string = "";
  password: string = "";
  companyName: string = "";
  address: string = "";
  taxDepartment: string = "";
  taxIdNumber: string = "";
  identityNumber: string = "";


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", (Validators.required, Validators.email)],
      password: ["", Validators.required],
      companyName: ["", Validators.required],
      address: ["", Validators.required],
      taxDepartment: ["", Validators.required],
      taxIdNumber: [""],
      identityNumber: [""],
      addetAt: [Date.now()],
      isActive: [true]
    })
  }

  register() {
    if (this.isTermsAndConditionsChecked) {
      if (this.registerForm.valid) {
        this.isRegisterButtonActive = false;
        let registerModel = Object.assign({}, this.registerForm.value);

        // apiye gönderilecek veri
        this.registerDto = {
          "company": {
            addetAt: (this.datePipe.transform(Date(), 'yyyy-MM-dd')),
            address: registerModel.address,
            id: 0,
            identityNumber: registerModel.identityNumber,
            name: registerModel.companyName,
            isActive: true,
            taxIdNumber: registerModel.taxIdNumber,
            taxDepartment: registerModel.taxDepartment
          },
          "userForRegister": {
            email: registerModel.email,
            password: registerModel.password,
            name: registerModel.name
          }
        }

        this.authService.register(this.registerDto).subscribe((res) => {
          this.isFormComplete = true;
          this.toastr.success(res.message, "Başarılı");
        }, (err) => {
          this.isRegisterButtonActive = true;
          this.toastr.error(err.error, "Hata!");
        })
      }
      else {
        this.isRegisterButtonActive = true;
        this.toastr.error("Eksik bilgileri doldurun", "Hata!");
      }
    } else {
      this.toastr.warning("Sözleşmeyi onaylamanız gerekmektedir", "Hata!");
    }

  }

  getTermsAndConditions() {
    this.authService.getTermsAndConditions().subscribe((res) => {
      this.termsAndConditions = res.data;
    }, (err) => {
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

}
