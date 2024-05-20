import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalDays'
})
export class TotalDaysPipe implements PipeTransform {

  transform(value: number):number {

    const createJobDate = value;
    const todaysDate = new Date().getTime();

    const differenceInMilliseconds = todaysDate - createJobDate;

    const totalDays = Math.round(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return totalDays;
  }

}
