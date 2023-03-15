import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordDto } from 'src/app/models/dtos/changePasswordDto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  isActive: boolean = false;
  isSuccess: boolean = true;
  value: string = "";
  message: string = "";
  password: string = "";
  isForgotPasswordButtonActive: boolean = true;
  changePasswordDto: ChangePasswordDto;
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {
      this.confirmEmail(p["value"]);
      this.value = p["value"];
    })
  }


  confirmEmail(value: string) {
    this.authService.forgotPasswordLinkCheck(value).subscribe((res) => {
      if (res == true) {
        this.isActive = true;
        this.isSuccess = true;
      }
    }, (err) => {
      this.isActive = true;
      this.isSuccess = false;
      this.message = err.error;
    })

  }



  styleInputChange(text: string) {
    if (text != "") {
      return "input-group input-group-outline is-valid my-3";
    } else {
      return "input-group input-group-outline is-invalid my-3"
    }
  }

  changePassword() {
    this.changePasswordDto = {
      password: this.password,
      value: this.value
    };

    this.authService.changePasswordToForgotPassword(this.changePasswordDto).subscribe((res) => {
      this.router.navigateByUrl("/login");
      this.toastr.success(res.message, "Başarılı");
    }, (err) => {
      this.toastr.error(err.error, "Hata!");
    })
  }
}
