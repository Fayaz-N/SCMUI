import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { DynamicSearchResult, searchList, mprRevision, mprFilterParams, Employee } from '../Models/mpr';
import { MprService } from '../services/mpr.service';
import { constants } from '../Models/MPRConstants'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-MPRList',
  templateUrl: './MPRList.component.html'
})
export class MPRListComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public constants: constants, private route: ActivatedRoute, private router: Router,) { }
  public employee: Employee;
  public MPRfilterForm: FormGroup;
  public formName: string;
  public txtName: string;
  public dynamicData = new DynamicSearchResult();
  public showList: boolean = false;
  public searchItems: Array<searchList> = [];
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public mprList: Array<any> = [];
  public showFilterBlock: boolean = false
  public mprFilterParams: mprFilterParams;
  public typeOfList: string;
  public statusList: Array<any> = [];
  loading: boolean;


  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"))[0];
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.typeOfList = this.route.routeConfig.path;
    this.mprFilterParams = new mprFilterParams();
    this.mprFilterParams.ToDate = new Date();
    this.mprFilterParams.FromDate = new Date(new Date().setDate(new Date().getDate() - 30));


    this.MPRfilterForm = this.formBuilder.group({
      DocumentNo: ['', [Validators.required]],
      DocumentDescription: ['', [Validators.required]],
      FromDate: ['', [Validators.required]],
      ToDate: ['', [Validators.required]],
      CheckedBy: ['', [Validators.required]],
      ApprovedBy: ['', [Validators.required]],
      CheckerStatus: ['', [Validators.required]],
      ApprovalStatus: ['', [Validators.required]]
    });
    if (this.typeOfList == "mprCheckerList") {
      this.MPRfilterForm.controls["CheckedBy"].setValue(this.employee.Name);
      this.mprFilterParams.CheckedBy = this.employee.EmployeeNo;
    }
    else if (this.typeOfList == "mprApproverList") {
      this.MPRfilterForm.controls["ApprovedBy"].setValue(this.employee.Name);
      this.mprFilterParams.ApprovedBy = this.employee.EmployeeNo;
    }
    else {
      this.MPRfilterForm.controls["CheckedBy"].setValue("");
      this.mprFilterParams.ApprovedBy = "";
      this.MPRfilterForm.controls["ApprovedBy"].setValue("");
      this.mprFilterParams.CheckedBy = "";

    }
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
    this.mprFilterParams.FromDate = new Date(this.mprFilterParams.FromDate);
    this.mprFilterParams.ToDate = new Date(this.mprFilterParams.ToDate);
    this.MprService.getMPRList(this.mprFilterParams).subscribe(data => {
      this.mprList = data;
      this.loading = false;
    })
  }
  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.formName = formName;
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    this.MprService.GetListItems(this.dynamicData).subscribe(data => {
      if (data.length == 0)
        this.showList = false;
      else
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
    this[this.formName].controls[this.txtName].updateValueAndValidity()
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

}


