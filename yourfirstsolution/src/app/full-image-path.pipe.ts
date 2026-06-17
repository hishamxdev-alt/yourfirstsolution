import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullImagePath'
})
export class FullImagePathPipe implements PipeTransform {

  transform(value: string): string {
    const baseUrl = 'https://yourfirstsolution.com/api/';
    return value ? baseUrl + value : '';
  }

}
