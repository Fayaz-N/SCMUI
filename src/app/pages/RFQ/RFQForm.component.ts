import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { Employee, DynamicSearchResult, AccessList, searchList } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { RfqService } from 'src/app/services/rfq.service ';
import { constants } from 'src/app/Models/MPRConstants';
import { RFQRevisionData, RFQMasters, RfqItemModel, RfqItemInfoModel } from 'src/app/Models/rfq';


@Component({
  selector: 'app-RFQForm',
  templateUrl: './RFQForm.component.html'
})
export class RFQFormComponent implements OnInit {
  constructor(private router: Router, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public RfqService: RfqService, public constants: constants, private route: ActivatedRoute, private messageService: MessageService, private spinner: NgxSpinnerService, public sanitizer: DomSanitizer) { }

  //variable Declarations start
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public RFQForm; AddItemForm; addItemInfoForm: FormGroup;
  public rfqRevisionModel: RFQRevisionData;
  public rfqFormEdit; rfqSubmitted; showRfqItem; showList; AddItemDialog; AddItemInfodialog; itemSubmitted; itemInfoSubmitted: boolean = false;
  public formName: string;
  public txtName: string;
  public selectedItem: searchList;
  public dynamicData = new DynamicSearchResult();
  public searchItems: Array<searchList> = [];
  public searchresult: Array<object> = [];
  public rfqItem: RfqItemModel;
  public rfqItemInfo: RfqItemInfoModel;
  public currncyArray: any[] = [];

  //page load eventl
  ngOnInit() {

    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));

    else {
      this.router.navigateByUrl("Login");
      return;
    }
    if (localStorage.getItem("AccessList")) {
      this.AccessList = JSON.parse(localStorage.getItem("AccessList"));
    }
    this.rfqRevisionModel = new RFQRevisionData();
    this.rfqRevisionModel.rfqmaster = new RFQMasters();
    this.rfqRevisionModel.rfqitem = [];
    this.rfqRevisionModel.RFQType = "0";
    this.rfqItem = new RfqItemModel();
    this.rfqItemInfo = new RfqItemInfoModel();
    this.currncyArray = [];

    this.RFQForm = this.formBuilder.group({
      venderid: ['', [Validators.required]],
      RFQType: ['', [Validators.required]],
      QuoteValidFrom: ['', [Validators.required]],
      QuoteValidTo: ['', [Validators.required]],
      VendorVisibility: ['', [Validators.required]]
    });

    this.AddItemForm = this.formBuilder.group({
      ItemId: ['', [Validators.required]],
      QuotationQty: ['', [Validators.required]],
      VendorModelNo: ['', [Validators.required]],
      HSNCode: ['', [Validators.required]],
      FreightPercentage: ['', [Validators.required]],
      FreightAmount: ['', [Validators.required]],
      PFPercentage: ['', [Validators.required]],
      PFAmount: ['', [Validators.required]],
      IGSTPercentage: ['', [Validators.required]],
      CGSTPercentage: ['', [Validators.required]],
      SGSTPercentage: ['', [Validators.required]],
      MfgPartNo: ['', [Validators.required]],
      MfgModelNo: ['', [Validators.required]],
      RequestRemarks: ['', [Validators.required]],
    });

    this.addItemInfoForm = this.formBuilder.group({
      StartQty: ['', [Validators.required]],
      EndQty: ['', [Validators.required]],
      Qty: ['', [Validators.required]],
      UnitPrice: ['', [Validators.required]],
      CurrencyId: ['', [Validators.required]],
      CurrencyValue: ['', [Validators.required]],

      DeliveryDays: ['', [Validators.required]],
      DeliveryDate: ['', [Validators.required]],
      ValidFrom: ['', [Validators.required]],
      ValidTo: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
      Status: ['', [Validators.required]]

    })
    this.RFQForm.controls['RFQType'].clearValidators();
    this.RFQForm.controls['VendorVisibility'].clearValidators();
    this.AddItemForm.controls['RequestRemarks'].clearValidators();
    this.AddItemForm.controls['VendorModelNo'].clearValidators();
    this.addItemInfoForm.controls['DeliveryDays'].clearValidators();
    this.addItemInfoForm.controls['DeliveryDate'].clearValidators();
    this.addItemInfoForm.controls['StartQty'].clearValidators();
    this.addItemInfoForm.controls['EndQty'].clearValidators();
    this.addItemInfoForm.controls['Qty'].clearValidators();

    this.loadCurrency();
    this.route.params.subscribe(params => {
      if (params["RFQRevisionId"] && !this.constants.RequisitionId) {
        var revisionId = params["RFQRevisionId"];
        this.spinner.show();
        this.loadRFQData(revisionId);
      }
    });
  }

  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.formName = formName;
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    searchTxt = searchTxt.replace('*', '%');
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

      this.selectedItem = this.searchItems.filter(li => li.code == this.RFQForm[name])[0];
      if (callback)
        callback();
    });
  }

  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;

    if (this.formName != "") {
      this[this.formName].controls[this.txtName].setValue(item.name);
      if (item.listName == "venderid")
        this.rfqRevisionModel.rfqmaster.VendorId = item.code;
      if (item.listName == "ItemId")
        this.rfqItem.ItemId = item.code;
    }
    this[this.formName].controls[this.txtName].updateValueAndValidity()
  }

  loadCurrency() {
    this.RfqService.GetAllMasterCurrency().
      subscribe(
        res => {
          //this._list = res; //save posts in array
          this.currncyArray = res;
          let _list: any[] = [];
          for (let i = 0; i < (res.length); i++) {
            _list.push({
              CurrencyName: res[i].CurrencyName,
              CurrenyId: res[i].CurrenyId
            });
          }
          this.currncyArray = _list;
          this.rfqItemInfo.CurrencyId = 0;
        });
  }

  showItemDialog() {
    this.AddItemDialog = true;
    this.rfqItem = new RfqItemModel();
    this.AddItemForm.controls.ItemId.value = "";
  }

  Cancel(dialog: string) {
    this[dialog] = false;
  }

  dialogCancel(dialogName) {
    this[dialogName] = false;
  }

  onRFQsubmit() {
    this.rfqSubmitted = true;
    
    if (this.RFQForm.invalid) {
      return;
    }
    else {
      this.rfqRevisionModel.CreatedBy = parseInt(this.employee.EmployeeNo);
      this.rfqRevisionModel.rfqmaster.CreatedBy = this.employee.EmployeeNo;

      this.RfqService.CreateRfq(this.rfqRevisionModel).subscribe(data => {
        this.rfqRevisionModel = data;
        this.showRfqItem = true;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Submitted' });

      })
    }
  }

  InsertRFQItem() {
    this.itemSubmitted = true;
    if (this.AddItemForm.invalid) {
      return;
    }
    else {
      this.rfqRevisionModel.rfqitem = [];
      this.rfqRevisionModel.rfqitem.push(this.rfqItem);

      this.RfqService.CreateRfq(this.rfqRevisionModel).subscribe(data => {
        this.rfqRevisionModel = data;
        this.AddItemDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Items Submitted' });
        this.itemSubmitted = false;
      })
    }
  }

  InsertRFQItemInfo() {
    this.itemInfoSubmitted = true;
    if (this.addItemInfoForm.invalid) {
      return;
    }
    else {
      this.RfqService.InsertRfqItemInfo(this.rfqItemInfo).subscribe(data => {
        this.rfqRevisionModel = data;
        this.AddItemInfodialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Items Info Submitted' });
        this.itemInfoSubmitted = false;
      })
    }
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

  PFPercentageChange() {
    if (this.AddItemForm.controls['PFPercentage'].value != "") {
      this.AddItemForm.controls['PFAmount'].setValue("");
      this.AddItemForm.controls['PFAmount'].clearValidators();
    }
    this.AddItemForm.controls['PFAmount'].updateValueAndValidity();
  }

  PFAmountChange() {
    if (this.AddItemForm.controls['PFAmount'].value != "") {
      this.AddItemForm.controls['PFPercentage'].setValue("");
      this.AddItemForm.controls['PFPercentage'].clearValidators();
    }
    this.AddItemForm.controls['PFPercentage'].updateValueAndValidity();
  }

  FreightPercentageChange() {
    if (this.AddItemForm.controls['FreightPercentage'].value != "") {
      this.AddItemForm.controls['FreightAmount'].setValue("");
      this.AddItemForm.controls['FreightAmount'].clearValidators();
    }
    this.AddItemForm.controls['FreightAmount'].updateValueAndValidity();
  }

  FreightAmountChange() {
    if (this.AddItemForm.controls['FreightAmount'].value != "") {
      this.AddItemForm.controls['FreightPercentage'].setValue("");
      this.AddItemForm.controls['FreightPercentage'].clearValidators();
    }
    this.AddItemForm.controls['FreightPercentage'].updateValueAndValidity();
  }
  IGSTPercentageChange() {
    if (this.AddItemForm.controls['IGSTPercentage'].value != "") {
      this.AddItemForm.controls['SGSTPercentage'].setValue("");
      this.AddItemForm.controls['CGSTPercentage'].setValue("");
      this.AddItemForm.controls['SGSTPercentage'].clearValidators();
      this.AddItemForm.controls['CGSTPercentage'].clearValidators();
    }
  }

  IGSTEnablefromCGSTChange() {
    if (this.AddItemForm.controls['CGSTPercentage'].value != "") {
      this.AddItemForm.controls['IGSTPercentage'].setValue("");
      this.AddItemForm.controls['IGSTPercentage'].clearValidators();
    }
  }
  IGSTEnablefromSGSTChange() {
    if (this.AddItemForm.controls['SGSTPercentage'].value != "") {
      this.AddItemForm.controls['IGSTPercentage'].setValue("");
      this.AddItemForm.controls['IGSTPercentage'].clearValidators();
    }
  }
  rfqTypeChange() {
    if (this.rfqRevisionModel.RFQType == "Rate Contract") {
      this.RFQForm.controls['QuoteValidFrom'].setValidators([Validators.required]);
      this.RFQForm.controls['QuoteValidTo'].setValidators([Validators.required]);
    }
    else {
      this.RFQForm.controls['QuoteValidFrom'].setValue("");
      this.RFQForm.controls['QuoteValidTo'].setValue("");
      this.RFQForm.controls['QuoteValidFrom'].clearValidators();
      this.RFQForm.controls['QuoteValidTo'].clearValidators();
    }
    this.RFQForm.controls['QuoteValidFrom'].updateValueAndValidity();
    this.RFQForm.controls['QuoteValidTo'].updateValueAndValidity();
  }

  showItemInfo(rfqItemId: any) {
    this.AddItemInfodialog = true;
    this.rfqItemInfo = new RfqItemInfoModel();
    this.rfqItemInfo.RFQItemsId = rfqItemId;
    this.rfqItemInfo.CurrencyId = 0;
    this.rfqItemInfo.Status = "Approved";
  }

  onItemEdit(e: any,details: RfqItemModel) {
    this.rfqItem = details;
    this.AddItemDialog = true;
    this.bindSearchListData(e, 'AddItemForm', 'ItemId', "", (): any => {
      this.showList = false;
      if (details.ItemId == "0000")
        this.AddItemForm.controls.ItemId.value = "NewItem";
      else
        this.AddItemForm.controls.ItemId.value = this.searchItems.filter(li => li.listName == "ItemId" && li.code == details.ItemId)[0].name;
      this.AddItemForm.value.ItemId = details.ItemId;
      this.AddItemForm.controls['ItemId'].updateValueAndValidity();
    });
    if (details.PFAmount)
      this.PFAmountChange();
    if (details.PFPercentage)
      this.PFPercentageChange();
    if (details.FreightAmount)
      this.FreightAmountChange();
    if (details.FreightPercentage)
      this.FreightPercentageChange();
    if (details.IGSTPercentage)
      this.IGSTPercentageChange();
    if (details.CGSTPercentage)
      this.IGSTEnablefromCGSTChange();    
    if (details.SGSTPercentage)
      this.IGSTEnablefromSGSTChange();
   
  }

  onItemInfoEdit(details: RfqItemInfoModel) {
    this.rfqItemInfo = details;
    this.currncyArray = this.currncyArray;
   // this.rfqItemInfo.CurrencyId = details.CurrencyId;
    this.AddItemInfodialog = true;
    this.rfqItemInfo.ValidFrom = new Date(this.rfqItemInfo.ValidFrom);
    this.rfqItemInfo.ValidTo = new Date(this.rfqItemInfo.ValidTo);
    this.addItemInfoForm.controls["ValidFrom"].setValue(this.rfqItemInfo.ValidFrom);
    this.addItemInfoForm.controls["ValidTo"].setValue(this.rfqItemInfo.ValidTo);
    
   
  }
  ondeleteRFQItem(rfqItem: RfqItemModel, itemindex: number) {
    this.RfqService.DeleteRfqItemByid(rfqItem.RFQItemsId).subscribe(data => {
      var index1 = this.rfqRevisionModel.rfqitem.findIndex(x => x.RFQItemsId == rfqItem.RFQItemsId);
       this.rfqRevisionModel.rfqitem.splice(index1, 1);
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Deleted' });

    })
  }

  ondeleteRFQItemInfo(rfqItemInfo: RfqItemInfoModel,itemindex:number, index: number) {
    this.RfqService.DeleteRfqIteminfoByid(rfqItemInfo.RFQSplitItemId).subscribe(data => {
      var index1 = this.rfqRevisionModel.rfqitem[itemindex].iteminfo.findIndex(x => x.RFQSplitItemId == rfqItemInfo.RFQSplitItemId);
      this.rfqRevisionModel.rfqitem[itemindex].iteminfo.splice(index1, 1);
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Deleted' });
    })
  }
  loadRFQData(revisionId: number) {
    this.RfqService.GetRfqDetailsById(revisionId).subscribe(data => {
      this.rfqRevisionModel = data;
      this.RFQForm.controls["QuoteValidFrom"].setValue(this.rfqRevisionModel.QuoteValidFrom);
      this.RFQForm.controls["QuoteValidTo"].setValue(this.rfqRevisionModel.QuoteValidTo);

      this.showRfqItem = true;
      this.spinner.hide();
      this.RFQForm.controls["venderid"].setValue(this.rfqRevisionModel.rfqmaster.Vendor.VendorName);
      this.rfqTypeChange();
    })
  }
}



