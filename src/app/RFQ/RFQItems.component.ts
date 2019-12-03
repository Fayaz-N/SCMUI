import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { constants } from '../Models/MPRConstants'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RfqService } from '../services/rfq.service ';
import { MPRVendorDetail, searchList, DynamicSearchResult } from '../Models/mpr';
import { MprService } from '../services/mpr.service';
import { rfqQuoteModel } from '../Models/rfq';

@Component({
  selector: 'app-RFQItems',
  templateUrl: './RFQItems.component.html'
})

export class RFQItemsComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public RfqService: RfqService, public MprService: MprService, public constants: constants, private route: ActivatedRoute) { }

  public txtName: string;
  public dynamicData = new DynamicSearchResult();
  public showList: boolean = false;
  public searchItems: Array<searchList> = [];
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public showVendorDialog: boolean = false;
  public vendorDetails: MPRVendorDetail;
  public vendorDetailsArray: Array<MPRVendorDetail> = [];
  public vendorSubmitted: boolean = false;
  public rfqItems: Array<any> = [];
  public RevisionId: number;
  public rfqQuoteModel: Array<rfqQuoteModel> = [];
  public vendorsLength: number = 2;
  public selectedIndex: string;
  public selectedVendorList: Array<any> = [];

  //page load event
  ngOnInit() {
    this.vendorDetails = new MPRVendorDetail();
    this.route.params.subscribe(params => {
      if (params["RevisionId"]) {
        this.RevisionId = params["RevisionId"];
        this.getRFQItems();
      }
    });

  }
  openMPR3Dialog(dialogName: string) {
    this[dialogName] = true;
    this.vendorDetails = new MPRVendorDetail();
  }
  dialogCancel(dialogName) {
    this[dialogName] = false;
  }

  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
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

      if (callback)
        callback();
    });
  }
  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {

    if (this.vendorDetailsArray.filter(li => li.Vendorid == item.code).length > 0) {
      alert("vendor already exist");
      return false;
    }
    else {
      this.showList = false;
      this.vendorDetails.Vendorid = item.code;
      this.vendorDetails.VendorName = item.name
    }
  }

  onVendorSubmit(dialogName: string, type: string) {
    if (type == "vendorDetails") {
      this.vendorSubmitted = true;
      if (!this.vendorDetails.VendorName)
        return;
      else {
        this.vendorSubmitted = false;
        this.vendorDetailsArray = [];
        this.vendorDetailsArray.push(this.vendorDetails);
        this.MprService.updateMPRVendor(this.vendorDetailsArray, this.RevisionId).subscribe(data => {
          this[dialogName] = false;
          this.vendorDetailsArray = data;
        });
      }
    }
  }

  getRFQItems() {
    this.RfqService.getRFQItems(this.RevisionId).subscribe(data => {
      this.rfqItems = data;
      this.prepareRfQItems();
    })
  }

  prepareRfQItems() {
    for (var i = 0; i < this.rfqItems.length; i++) {
      var res = this.rfqQuoteModel.filter(li => li.ItemId == this.rfqItems[i].ItemId);
      if (res.length == 0) {
        var rfqQuoteItems = new rfqQuoteModel();
        rfqQuoteItems.MPRItemDetailsid = this.rfqItems[i].MPRItemDetailsid;
        rfqQuoteItems.ItemId = this.rfqItems[i].ItemId;
        rfqQuoteItems.ItemName = this.rfqItems[i].ItemName;
        rfqQuoteItems.ItemDescription = this.rfqItems[i].ItemDescription;
        rfqQuoteItems.TargetSpend = this.rfqItems[i].TargetSpend;
        rfqQuoteItems.QuotationQty = this.rfqItems[i].QuotationQty;
        rfqQuoteItems.vendorDetails = this.rfqItems.filter(li => li.ItemId == this.rfqItems[i].ItemId);
        this.rfqQuoteModel.push(rfqQuoteItems);
      }
    }
  }
  selectVendorList(itemsIndex: number, vendorIndex: number, vendor: any) {
    var index = this.selectedVendorList.findIndex(x => x.RFQItemsId == vendor.RFQItemsId);
    if (index > -1)
      this.selectedVendorList.splice(index, 1);
    this.selectedVendorList.push(vendor);
  }

  onVendorQuoteUpdate() {
    this.RfqService.updateVendorQuotes(this.selectedVendorList).subscribe(data => {

    })
  }

}


