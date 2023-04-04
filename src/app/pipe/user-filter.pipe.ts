import { Pipe, PipeTransform } from '@angular/core';
import { UserReletionShipDto } from '../models/dtos/userReletionShipDto';
import { UserDto } from '../models/userDto';

@Pipe({
  name: 'userFilterPipe'
})
export class UserFilterPipe implements PipeTransform {

  transform(value: UserReletionShipDto[], filterText: string): UserReletionShipDto[] {
    return filterText ? value.filter((p: UserReletionShipDto) => p.userIsActive.toString().toLowerCase().indexOf(filterText) !== -1) : value;
  }

}
