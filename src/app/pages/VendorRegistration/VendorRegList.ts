import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { Router } from '@angular/router';
import { Employee, vendorRegfilters, DynamicSearchResult } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-VendorList',
  templateUrl: './VendorRegList.component.html'
})

export class VendorRegListComponent implements OnInit {

  constructor(public MprService: MprService, private router: Router, public constants: constants, private spinner: NgxSpinnerService) { }

  public employee: Employee;
  public vendorRegfilters: vendorRegfilters;
  public vendorReqList: Array<any> = [];
  public verifyEmpList: Array<any> = [];
  public statusList: Array<any> = [];
  public dynamicData = new DynamicSearchResult();

  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }

    this.vendorRegfilters = new vendorRegfilters();
    this.vendorRegfilters.IntiatedBy = "";
    this.vendorRegfilters.CheckedBy = "";
    this.vendorRegfilters.ApprovedBy = "";
    this.vendorRegfilters.VerifiedBy = "";
    this.vendorReqList = [];
    this.getEmplist();
    this.getStatusList();
    this.getVendorReqList();

  }


  getEmplist() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select EmployeeNo,Name from employee where  DOL is null and OrgDepartmentId=14 or OrgDepartmentId=9";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.verifyEmpList = data;
    })
  }

  //get status list
  getStatusList() {
    this.MprService.getStatusList().subscribe(data => {
      this.statusList = data;
    })
  }

  getVendorReqList() {
    this.spinner.show();
    this.MprService.getVendorReqList(this.vendorRegfilters).subscribe(data => {
      this.spinner.hide();
      this.vendorReqList = data;
    });
  }


  toVendorReg(details: any) {
    this.router.navigate([]).then(result => {
      window.open('/SCM/VendorRegInitiate/' + details.Vendorid + '', '_blank');
    });
  }
}
