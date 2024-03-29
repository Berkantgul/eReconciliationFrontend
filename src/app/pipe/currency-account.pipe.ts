import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyAccountPipe'
})
export class CurrencyAccountPipe implements PipeTransform {

  transform(value: any[], searchString: string) {
    if (!searchString) {
      return value;
    }
    return value.filter(i => {
      const code = i.code.toLowerCase().toString().includes(searchString.toLowerCase())
      const name = i.name.toLowerCase().toString().includes(searchString.toLowerCase())
      const address = i.address.toLowerCase().toString().includes(searchString.toLowerCase())
      const taxDepartment = i.taxDepartment.toLowerCase().toString().includes(searchString.toLowerCase())
      const email = i.email.toLowerCase().toString().includes(searchString.toLowerCase())
      const authorized = i.authorized.toLowerCase().toString().includes(searchString.toLowerCase())

      return (code + name + address + taxDepartment + email + authorized)
    })
  }

}
