import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee, AccessList } from 'src/app/Models/mpr';
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
  public AccessList: Array<AccessList> = [];
  menu = MENU_ITEMS;
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
      this.AccessList = JSON.parse(localStorage.getItem("AccessList"));
      if (this.AccessList.filter(li => li.AccessName == "CreateMPR").length <= 0) {
        var index = MENU_ITEMS[1].children.findIndex(li => li.title == "MPR Form");
        MENU_ITEMS[1].children.splice(index, 1);
      }
      if (this.employee.OrgDepartmentId != 14)//cmm users
      {
        MENU_ITEMS[2].hidden = true;
        MENU_ITEMS[3].hidden = true;
        MENU_ITEMS[4].hidden = true;
        MENU_ITEMS[5].hidden = true;
        MENU_ITEMS[6].hidden = true;
        MENU_ITEMS[7].hidden = true;
      }
      else {
        MENU_ITEMS[2].hidden = false;
        MENU_ITEMS[3].hidden = false;
        MENU_ITEMS[4].hidden = false;
        MENU_ITEMS[5].hidden = false;
        MENU_ITEMS[6].hidden = false;
        MENU_ITEMS[7].hidden = false;
      }
      if (this.AccessList.filter(li => li.AccessName == "AddMasters").length <= 0)
        MENU_ITEMS[3].hidden = true;//masters
      if (this.AccessList.filter(li => li.AccessName == "AddAutherization").length <= 0)
        MENU_ITEMS[5].hidden = true;//auth
      if (this.AccessList.filter(li => li.AccessName == "SavingsReport").length <= 0) {
        var index = MENU_ITEMS[6].children.findIndex(li => li.title == "Savings Report");
        MENU_ITEMS[6].children[index].hidden = true;
      }
      else {
        var index = MENU_ITEMS[6].children.findIndex(li => li.title == "Savings Report");
        MENU_ITEMS[6].children[index].hidden = false;
      }
      if (this.AccessList.filter(li => li.AccessName == "MPRStatusTrack").length <= 0) {
        var index = MENU_ITEMS[6].children.findIndex(li => li.title == "MPR Status Track");
        MENU_ITEMS[6].children[index].hidden = true;
      }
      else {
        var index = MENU_ITEMS[6].children.findIndex(li => li.title == "MPR Status Track");
        MENU_ITEMS[6].children[index].hidden = false;
      }
    }

    else
      this.router.navigateByUrl("Login");

  }

}
