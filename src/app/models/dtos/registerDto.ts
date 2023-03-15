import { CompanyModel } from "../companyModel";
import { RegisterModel } from "../registerModel";

export interface RegisterDto {
  company: CompanyModel;
  userForRegister: RegisterModel;
}
