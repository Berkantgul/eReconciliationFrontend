import { CompanyModel } from "../companyModel";

export interface UserReletionShipDto {
  id: number,
  adminUserId: number,
  adminUserName: string,
  adminMail: string,
  adminAddetAt: string,
  adminIsActive: boolean,
  userUserId: number,
  userUserName: string,
  userMail: string,
  userMailValue: string,
  userAddetAt: string,
  userIsActive: boolean,
  companies: CompanyModel[]
}
