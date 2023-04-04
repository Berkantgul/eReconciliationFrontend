import { CompanyModel } from "../companyModel";

export interface AdminCompaniesForUserDto extends CompanyModel {
  isTrue: boolean
}
