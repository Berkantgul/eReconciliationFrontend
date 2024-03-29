import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userOperationClaimPipe'
})
export class UserOperationClaimPipe implements PipeTransform {

  transform(value: any[], searchString: string) {
    if (!searchString) {
      return value;
    }
    return value.filter(i => {
      const name = i.name.toLowerCase().toString().includes(searchString.toLowerCase())

      return (name)
    })
  }

}
