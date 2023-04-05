import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { ConfirmComponent } from './components/register/confirm/confirm.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NavComponent } from './components/nav/nav.component';
import { CurrencyAccountComponent } from './components/currency-account/currency-account.component';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { CurrencyAccountPipe } from './pipe/currency-account.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CurrencyAccountFilterPipe } from './pipe/currency-account-filter.pipe';
import { UserComponent } from './components/user/user.component';
import { UserPipe } from './pipe/user.pipe';
import { UserFilterPipe } from './pipe/user-filter.pipe';
import { UserOperationClaimComponent } from './components/user/user-operation-claim/user-operation-claim.component';
import { UserOperationClaimPipe } from './pipe/user-operation-claim.pipe';
import { CompanyComponent } from './components/company/company.component';
import { CompanyPipe } from './pipe/company.pipe';
import { CompanyFilterPipe } from './pipe/company-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmComponent,
    ForgotPasswordComponent,
    SidenavComponent,
    NavComponent,
    CurrencyAccountComponent,
    CurrencyAccountPipe,
    CurrencyAccountFilterPipe,
    UserComponent,
    UserPipe,
    UserFilterPipe,
    UserOperationClaimComponent,
    UserOperationClaimPipe,
    CompanyComponent,
    CompanyPipe,
    CompanyFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    SweetAlert2Module.forRoot(),
    ToastrModule.forRoot({
      progressBar: true,
      timeOut: 3000
    }),
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: 'apiUrl', useValue: 'https://localhost:7127/api/' },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    [DatePipe]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
