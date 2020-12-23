import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { Router } from '@angular/router';
import { Employee, vendorRegfilters, DynamicSearchResult } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-VendorPendingList',
  templateUrl: './VendorRegPendingList.component.html'
})

export class VendorRegPendingListComponent implements OnInit {

  constructor(public MprService: MprService, private router: Router, public constants: constants, private spinner: NgxSpinnerService) { }

  public employee: Employee;
  public vendorRegfilters: vendorRegfilters;
  public vendorReqList: Array<any> = [];
  public verifyEmpList: Array<any> = [];
  public statusList: Array<any> = [];
  public dynamicData = new DynamicSearchResult();
  public hideForVerifier: boolean = true;

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
    this.vendorRegfilters.ApprovedBy = this.constants.VendorReg_CMM_Approver;
    this.vendorRegfilters.VerifiedBy = "";
    this.vendorRegfilters.IntiatorStatus = this.vendorRegfilters.CheckerStatus = "Pending";
    //For Approver
    if (this.employee.EmployeeNo == this.constants.VendorReg_CMM_Approver) {
      this.vendorRegfilters.IntiatorStatus = this.vendorRegfilters.CheckerStatus = "Approved";
      this.vendorRegfilters.ApprovalStatus = "Pending";
    }
    //for finance Verifier
    else if (this.employee.EmployeeNo == this.constants.VendorReg_Verifier1 || this.employee.EmployeeNo == this.constants.VendorReg_Verifier2) {
      // this.vendorRegfilters.VerifiedBy = this.employee.EmployeeNo;
      this.vendorRegfilters.IntiatorStatus =this.vendorRegfilters.CheckerStatus = this.vendorRegfilters.ApprovalStatus = "Approved";
      this.vendorRegfilters.VerifiedStatus = "Pending";
      this.hideForVerifier = false;
    }
    //for finance Approver
    else if (this.employee.EmployeeNo == this.constants.VendorReg_Fin_Approver) {
      this.vendorRegfilters.IntiatorStatus =this.vendorRegfilters.CheckerStatus = this.vendorRegfilters.ApprovalStatus = this.vendorRegfilters.VerifiedStatus = "Approved";
      this.vendorRegfilters.FinanceApprovedStatus = "Pending";
    }
    else {
      this.vendorRegfilters.IntiatedBy = this.employee.EmployeeNo;
      this.vendorRegfilters.CheckedBy = this.employee.EmployeeNo;
    }
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
