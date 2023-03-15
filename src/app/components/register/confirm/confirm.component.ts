import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  isActive: boolean = false;
  isSuccess: boolean = false;
  message: string = "";
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {
      this.confirm(p["value"]);
    })
  }


  confirm(value: string) {
    this.authService.confirmUser(value).subscribe((res) => {
      this.isActive = true;
      this.isSuccess = true;
    }, (err) => {
      this.isActive = true;
      this.isSuccess = false;
      this.message = err.error;
    })
  }



}
