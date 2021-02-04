import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private router: Router) { }
  calculateAge(date: string) { // birthday is a date
    let difference = Date.parse(date);
    return Math.round((Date.now() - difference) / (1000 * 60 * 60 * 24 * 365.25));
  }

  navigate(url: string) {
    return this.router.navigate([url]);
  }

  formatDate(date?) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
