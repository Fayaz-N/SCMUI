import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/Models/mpr';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
    <p-toast [style]="{marginTop: '60px'}"  [showTransitionOptions]="'1000ms'" [hideTransitionOptions]="'1000ms'"></p-toast>
  `,
})
export class PagesComponent {

  constructor(private router: Router) { }
  public employee: Employee;
  menu = MENU_ITEMS;
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
      if (this.employee.OrgDepartmentId != 14)//cmm users
      {
        MENU_ITEMS[2].hidden = true;
        MENU_ITEMS[3].hidden = true;
        MENU_ITEMS[4].hidden = true;
        MENU_ITEMS[5].hidden = true;
      }
    }

    else
      this.router.navigateByUrl("Login");
    
  }

}
