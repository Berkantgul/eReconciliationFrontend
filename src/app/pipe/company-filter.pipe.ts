import { Pipe, PipeTransform } from '@angular/core';
import { CompanyModel } from '../models/companyModel';

@Pipe({
  name: 'companyFilterPipe'
})
export class CompanyFilterPipe implements PipeTransform {

  transform(value: CompanyModel[], filterText: string): CompanyModel[] {
    return filterText ? value.filter((p: CompanyModel) => p.isActive.toString().toLowerCase().indexOf(filterText) !== -1) : value;
  }

}
