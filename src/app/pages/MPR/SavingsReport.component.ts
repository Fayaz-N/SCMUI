import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { mprRevision, Employee, DynamicSearchResult, searchList, mprFilterParams, AccessList } from 'src/app/Models/mpr';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-SavingsReport',
  templateUrl: './SavingsReport.component.html'
})
export class SavingsReportComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, public MprService: MprService, public constants: constants, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private spinner: NgxSpinnerService) { }
  public mprTitle: string;
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public MPRfilterForm: FormGroup;
  public formName: string;
  public txtName: string;
  public dynamicData = new DynamicSearchResult();
  public showList; showFilterBlock; showCMMFilter: boolean = false;
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
  cols: any[];
  exportColumns: any[];
  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.cols = [
      //{ field: 'S.No', header: 'S.No' },
      { field: 'DocumentNo', header: 'MPR Document Number' },
      { field: 'DocumentDescription', header: 'Description' },
      { field: 'JobCode', header: 'Job Code' },
      { field: 'JobName', header: 'Job Name' },
      { field: 'DepartmentName', header: 'Dep Name' },
      { field: 'IssuePurposeId', header: 'Purpose of issuing MPR' },
      { field: 'ItemDescription', header: 'Item Description' },
      { field: 'BuyerGroupName', header: 'Buyer Group Name' },
      { field: 'AssignEmployeeName', header: 'AssignTo' },
      { field: 'MPRStatus', header: 'MPRStatus' },
      { field: 'PurchaseType', header: 'Purchase Type' },
      { field: 'PreviousPOPrice', header: 'Previous PO Price' },
      { field: 'CurrentPoPrice', header: 'Current PO Price' },
      { field: 'Savings', header: 'Savings' },
      { field: 'Difference', header: 'Difference' },
      { field: 'PONO', header: 'Current PO Number' },

    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    if (localStorage.getItem("AccessList")) {
      this.AccessList = JSON.parse(localStorage.getItem("AccessList"));
    }
    if (this.AccessList.filter(li => li.AccessName == "MPRCMMList").length > 0)
      this.showCMMFilter = true;
    this.mprTitle = "Savings Report";

    this.mprRevisionModel = new mprRevision();
    this.mprFilterParams = new mprFilterParams();

    this.toDate = new Date();
    this.fromDate = new Date(new Date().setDate(new Date().getDate() - 30));

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
      PurchaseTypeId: ['', [Validators.required]]
    });

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
    this.MprService.getSavingsReport(this.mprFilterParams).subscribe(data => {
      this.mprList = data;
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


  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.mprList);
        doc.save('savingsreport.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.getCars());
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "primengTable");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  getCars() {
    let mprItems = [];
    for (let item of this.mprList) {
      let object = new Object();
      this.cols.forEach(col => {
        //if (col.field == "Savings" && (item.Savings >= 0))
        //  object[col.field] = item.Savings;
        // if (col.field == "Difference" && (item.Savings < 0))
        //  object[col.field] = item.Difference;
        
          object[col.field] = item[col.field];
      });
      mprItems.push(object);
    }
    return mprItems;
  }
}



