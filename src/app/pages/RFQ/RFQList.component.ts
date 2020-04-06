import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { rfqFilterParams } from 'src/app/Models/rfq';
import { DynamicSearchResult, searchList, Employee } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants'
import { ActivatedRoute, Router } from '@angular/router';
import { RfqService } from 'src/app/services/rfq.service ';
import { MprService } from 'src/app/services/mpr.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-RFQList',
  templateUrl: './RFQList.component.html'
})
export class RFQListComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService, public MprService: MprService, public RfqService: RfqService, public constants: constants, private route: ActivatedRoute, private router: Router) { }
  public employee: Employee;
  public RFQfilterForm: FormGroup;
  public formName: string;
  public txtName: string;
  public dynamicData = new DynamicSearchResult();
  public showList: boolean = false;
  public searchItems: Array<searchList> = [];
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public rfqList: Array<any> = [];
  public showFilterBlock: boolean = false
  public rfqFilterParams: rfqFilterParams;
  public typeOfList: string;
  public statusList: Array<any> = [];
  loading: boolean;
  public fromDate: Date;
  public toDate: Date

  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee")) 
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else 
      this.router.navigateByUrl("Login");
    
    this.typeOfList = this.route.routeConfig.path;
    this.rfqFilterParams = new rfqFilterParams();
    this.toDate = new Date(new Date().setDate(new Date().getDate() + 90));
    this.fromDate = new Date(new Date().setDate(new Date().getDate() - 30));
    this.rfqFilterParams.RFQType = "0";
    this.rfqFilterParams.typeOfFilter = "1";

    this.RFQfilterForm = this.formBuilder.group({
      RFQType: ['', [Validators.required]],
      typeOfFilter: ['', [Validators.required]],
      FromDate: ['', [Validators.required]],
      ToDate: ['', [Validators.required]],
      RFQNo: ['', [Validators.required]],
      venderid: ['', [Validators.required]],
      DocumentNo: ['', [Validators.required]]
    });
    this.bindList();
    
  }
  //show and hide filter parmas
  showHideFilterBlock() {
    this.showFilterBlock = !this.showFilterBlock;
  }


  //bind rfq list
  bindList() {
    this.spinner.show();
    this.rfqFilterParams.FromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    this.rfqFilterParams.ToDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");

    this.RfqService.getRFQList(this.rfqFilterParams).subscribe(data => {
      this.rfqList = data;
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

      this.selectedItem = this.searchItems.filter(li => li.code == this.rfqFilterParams[name])[0];
      if (callback)
        callback();
    });
  }
  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;

    if (this.formName != "") {
      this[this.formName].controls[this.txtName].setValue(item.name);
      this.rfqFilterParams[this.txtName] = item.code;
    }
    this[this.formName].controls[this.txtName].updateValueAndValidity()
  }

  //clear model when search text is empty
  onsrchTxtChange(modelparm:string,value: string, model: string) {
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
  EditRfqdetails(revisionId: any) {
    this.router.navigate(['/SCM/RFQForm', revisionId]);
  }

}


