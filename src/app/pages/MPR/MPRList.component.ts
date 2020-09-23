import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { mprRevision, Employee, DynamicSearchResult, searchList, mprFilterParams, AccessList, DeleteMpr } from 'src/app/Models/mpr';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-MPRList',
  templateUrl: './MPRList.component.html'
})
export class MPRListComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, public MprService: MprService, public constants: constants, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private spinner: NgxSpinnerService, private messageService: MessageService) { }
  public mprTitle: string;
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public MPRfilterForm: FormGroup;
  public formName: string;
  public txtName: string;
  public dynamicData = new DynamicSearchResult();
  public showList; showFilterBlock; showCMMFilter; showDeletedialog: boolean = false;
  public searchItems: Array<searchList> = [];
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public mprList: Array<any> = [];
  public depDisable: boolean = false;
  public mprRevisionModel: mprRevision;
  public mprFilterParams: mprFilterParams;
  public typeOfList: string;
  public statusList: Array<any> = [];
  loading: boolean;
  public fromDate: Date;
  public toDate: Date
    public deleteMprInfo: DeleteMpr;

  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.deleteMprInfo = new DeleteMpr();
    if (localStorage.getItem("AccessList")) {
      this.AccessList = JSON.parse(localStorage.getItem("AccessList"));
    }
    if (this.AccessList.filter(li => li.AccessName == "MPRCMMList").length > 0)
      this.showCMMFilter = true;
    this.mprTitle = "MPR List";
    this.typeOfList = this.route.routeConfig.path;
    this.mprRevisionModel = new mprRevision();
    this.mprFilterParams = new mprFilterParams();
    if (this.showCMMFilter && this.typeOfList != "MPRPendingList")
      this.mprFilterParams.PreparedBy = "";
    else
      this.mprFilterParams.PreparedBy = this.employee.EmployeeNo;
    if (this.typeOfList == "MPRList") {
      //this.toDate = new Date();
      // this.fromDate = new Date(new Date().setDate(new Date().getDate() - 30));
    }

    this.MPRfilterForm = this.formBuilder.group({
      DocumentNo: ['', [Validators.required]],
      DocumentDescription: ['', [Validators.required]],
      FromDate: ['', [Validators.required]],
      ToDate: ['', [Validators.required]],
      CheckedBy: ['', [Validators.required]],
      ApprovedBy: ['', [Validators.required]],
      CheckerStatus: ['', [Validators.required]],
      ApprovalStatus: ['', [Validators.required]],
      IssuePurposeId: ['', [Validators.required]],
      DepartmentId: ['', [Validators.required]],
      JobCode: ['', [Validators.required]],
      ItemDescription: ['', [Validators.required]],
      GEPSApprovalId: ['', [Validators.required]],
      BuyerGroupId: ['', [Validators.required]],
      AssignEmployee: ['', [Validators.required]],
      MPRStatusId: ['', [Validators.required]],
      PurchaseTypeId: ['', [Validators.required]],
      mprStatusListId: ['', [Validators.required]],
      PONO: ['', [Validators.required]],
      PAID: ['', [Validators.required]]
    });

    this.mprFilterParams.ListType = this.typeOfList;
    if (this.typeOfList == "MPRCheckerList") {
      this.mprTitle = "MPR Checker List";
      this.MPRfilterForm.controls["CheckedBy"].setValue(this.employee.Name);
      this.mprFilterParams.CheckedBy = this.employee.EmployeeNo;
      this.mprFilterParams.PreparedBy = "";
    }
    else if (this.typeOfList == "MPRApproverList") {
      this.mprTitle = "MPR Approver List";
      this.MPRfilterForm.controls["ApprovedBy"].setValue(this.employee.Name);
      this.mprFilterParams.ApprovedBy = this.employee.EmployeeNo;
      this.mprFilterParams.PreparedBy = "";
    }
    else if (this.typeOfList == "MPRPendingList") {
      this.mprTitle = "MPR Pending List";
    }
    else if (this.typeOfList == "MPRSingleVendorList") {
      this.mprTitle = "Single Vendor Approver List";
      this.mprFilterParams.PreparedBy = "";
      this.mprFilterParams.SecOrThirdApprover = this.employee.EmployeeNo;
    }
    else {
      this.MPRfilterForm.controls["CheckedBy"].setValue("");
      this.mprFilterParams.ApprovedBy = "";
      this.MPRfilterForm.controls["ApprovedBy"].setValue("");
      this.mprFilterParams.CheckedBy = "";

    }
    //if (this.employee.OrgDepartmentId != null) {
    //  this.MPRfilterForm.controls["DepartmentId"].setValue(this.employee.OrgDepartmentName);
    //  this.mprFilterParams.DepartmentId = this.employee.OrgDepartmentId.toString();
    //}
    if (this.typeOfList == "MPRList") {
      if (this.employee.OrgDepartmentId == 14)//cmm
      {
        this.depDisable = false;
        this.mprFilterParams.DepartmentId = "";
        this.mprFilterParams.ORgDepartmentid = "";
      }
      else if (this.AccessList.filter(li => li.AccessName == "DepartmentWiseMPRList").length > 0) {
        this.showCMMFilter = true;
        this.depDisable = true;
        this.MPRfilterForm.controls["DepartmentId"].setValue(this.employee.OrgDepartmentName);
        this.mprFilterParams.ORgDepartmentid = this.employee.OrgDepartmentId.toString();
        this.mprFilterParams.DepartmentId = "";
        this.mprFilterParams.PreparedBy = "";
      }
      else {
        this.showCMMFilter = true;
        this.depDisable = true;
        this.MPRfilterForm.controls["DepartmentId"].setValue(this.employee.OrgDepartmentName);
        this.mprFilterParams.DepartmentId = "";
        this.mprFilterParams.ORgDepartmentid = "";
        this.mprFilterParams.PreparedBy = this.employee.EmployeeNo;
      }
    }

    this.mprFilterParams.mprStatusListId = [];
    this.mprFilterParams.mprStatusListId[0] = "2";

    this.getStatusList();

  }
  //show and hide filter parmas
  showHideFilterBlock() {
    this.showFilterBlock = !this.showFilterBlock;
  }

  getStatusList() {
    this.loading = true;
    this.MprService.getStatusList().subscribe(data => {
      this.statusList = data;
      this.mprFilterParams.Status = "Pending";
      this.bindList();
    })
  }

  //bind mpr list
  bindList() {
    this.spinner.show();
    this.mprFilterParams.FromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    this.mprFilterParams.ToDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    if (this.MPRfilterForm.controls.DepartmentId.value == "")
      this.mprFilterParams.DepartmentId = "";
    if (this.typeOfList != "MPRList")
      this.mprFilterParams.mprStatusListId = [];
    this.MprService.getMPRList(this.mprFilterParams).subscribe(data => {
      this.mprList = data;
      if (this.typeOfList == "MPRList") {
        if (this.employee.OrgDepartmentId == 14) {//for cmm
          this.mprList = this.mprList.filter(li => li.CheckStatus == "Approved" && li.ApprovalStatus == "Approved" && li.SecondApprover == '-' && li.ThirdApprover == '-' || (li.SecondApprover != '-' && li.SecondApproversStatus == 'Approved') || (li.ThirdApprover != '-' && li.ThirdApproverStatus == 'Approved'));
        } else {
          if (this.employee.OrgDepartmentId != 14) {
            this.mprList = this.mprList.filter(li => li.CheckedBy != '-' && li.ApprovedBy != "-");
          }
          if (this.AccessList.filter(li => li.AccessName == "DepartmentWiseMPRList").length > 0) {
          }
          else {
            //this.mprList = this.mprList.filter(li => li.PreparedBy == this.employee.EmployeeNo);
          }
        }
      }
      this.loading = false;
      this.spinner.hide();
    })
  }
  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.formName = formName;
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    searchTxt = searchTxt.replace('*', '%');
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '" + searchTxt + "%'";
    this.MprService.GetListItems(this.dynamicData).subscribe(data => {
      //if (data.length == 0)
      //  this.showList = false;
      //else
      this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {
        fName = item[this.constants[name].fieldName];
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId] };
        this.searchItems.push(value);
      });

      this.selectedItem = this.searchItems.filter(li => li.code == this.mprFilterParams[name])[0];
      if (callback)
        callback();
    });
  }
  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;

    if (this.formName != "") {
      this[this.formName].controls[this.txtName].setValue(item.name);
      this.mprFilterParams[this.txtName] = item.code;
    }
    this[this.formName].controls[this.txtName].updateValueAndValidity();

  }

  //clear model when search text is empty
  onsrchTxtChange(modelparm: string, value: string, model: string) {
    if (value == "") {
      this[model][modelparm] = "";
    }
  }


  dialogCancel(dialogName) {
    this[dialogName] = false;
  }
  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }
  onRowEditInit(mprData: any) {
    this.constants.RequisitionId = "";
    this.router.navigate(["/SCM/MPRForm", mprData.RevisionId]);
  }

  onRevise(mprData: any) {
    //this.constants.RequisitionId = mprData.RequisitionId;
    //this.router.navigate(["/SCM/MPRForm", mprData.RevisionId]);
    this.mprRevisionModel.PreparedBy = this.employee.EmployeeNo;
    this.mprRevisionModel.RevisionId = mprData.RevisionId;
    this.mprRevisionModel.RequisitionId = mprData.RequisitionId;
    this.spinner.show();
    this.MprService.copyMprRevision(this.mprRevisionModel, false, true).subscribe(data => {
      this.spinner.hide();
      this.router.navigate(["/SCM/MPRForm", data.RevisionId]);
    })

  }
  onRevisionCopy(mprData: any) {
    this.mprRevisionModel.PreparedBy = this.employee.EmployeeNo;
    this.mprRevisionModel.RevisionId = mprData.RevisionId;
    this.mprRevisionModel.RequisitionId = mprData.RequisitionId;
    this.spinner.show();
    this.MprService.copyMprRevision(this.mprRevisionModel, false, false).subscribe(data => {
      this.spinner.hide();
      this.router.navigate(["/SCM/MPRForm", data.RevisionId]);
    })

  }

  newMPRForm() {
    this.constants.newMpr = true;
    this.router.navigate(["/SCM/MPRForm"]);
  }
  onRowDelete(mprdeleteinfo: any) {
    this.showDeletedialog = true;
    this.deleteMprInfo = new DeleteMpr();
    this.deleteMprInfo.RevisionId = mprdeleteinfo.RevisionId;
  }

  deleteMpr() {
    if (this.deleteMprInfo.DeletedRemarks) {
      this.deleteMprInfo.Deletedby = this.employee.EmployeeNo;
      this.MprService.DeleteMpr(this.deleteMprInfo).subscribe(data => {
        this.messageService.add({ severity: 'sucess', summary: 'Sucess Message', detail: 'MPR Deleted' });
        this.showDeletedialog = false;
        var ind = this.mprList.findIndex(x => x.RevisionId == this.deleteMprInfo.RevisionId);
        if (ind > -1)
          this.mprList.splice(ind, 1);
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please Enter Remarks.' });
    }
    }
    //stauscheck(status:any) {
    //    let fruits: string[] =  ["PA Generated", "RFQ Generated", "RFQ Responded", "RFQ Finalized", "PA Approved", "MPR Closed", "PA Rejected", "Technical Spec Approved"]
    //    for (var i = 0; i >= 0; i++) {

    //    }
    //}
}


