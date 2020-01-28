import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { RfqService } from 'src/app/services/rfq.service ';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, DynamicSearchResult, searchList, MPRVendorDetail, VendorMaster } from 'src/app/Models/mpr';
import { rfqQuoteModel, RFQRevisionData } from 'src/app/Models/rfq';

@Component({
  selector: 'app-RFQItems',
  templateUrl: './GenerateRFQ.component.html'
})

export class GenerateRFQComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, public RfqService: RfqService, public MprService: MprService, public constants: constants, private route: ActivatedRoute, private router: Router, private messageService: MessageService) { }

  public newVendor: FormGroup;
  public employee: Employee;
  public txtName: string;
  public dynamicData = new DynamicSearchResult();
  public searchItems: Array<searchList> = [];
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public showList; showVendorDialog; showConformationDialog; showRevisionsDialog: boolean = false;
  public vendorDetails: MPRVendorDetail;
  public vendorDetailsArray: Array<MPRVendorDetail> = [];
  public vendorSubmitted: boolean = false;
  public totalRfqItems: Array<any> = [];
  public MPRRevisionId: number;
  public rfqQuoteModel: Array<rfqQuoteModel> = [];
  public vendorsLength: number = 2;
  public selectedIndex: string;
  public selectedVendorList: Array<any> = [];
  public cols: any[];
  public RFQRevisionData: RFQRevisionData;
  public YILTermsAndConditions: Array<any> = [];
  public mprVendors: boolean = false;
  public showNewVendor: boolean = false;
  public newVendorDetails: VendorMaster;

  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");
    this.vendorDetails = new MPRVendorDetail();
    this.RFQRevisionData = new RFQRevisionData();
    this.newVendorDetails = new VendorMaster();
    this.newVendor = this.formBuilder.group({
      VendorName: ['', [Validators.required]],
      Emailid: ['', [Validators.required]],
      ContactNo: ['', [Validators.required, Validators.maxLength(10)]]
    })

    this.route.params.subscribe(params => {
      if (params["MPRRevisionId"]) {
        this.MPRRevisionId = params["MPRRevisionId"];
        this.getRFQItems();
      }
    });
    //this.RFQRevisionData.RfqValidDate = this.constants.rfqValidDays;;
  }

  //Get total generated RFQ Items
  getRFQItems() {
    this.RfqService.getRFQItems(this.MPRRevisionId).subscribe(data => {
      this.totalRfqItems = data;
      this.dynamicData = new DynamicSearchResult();
      //this.dynamicData.tableName = "MPRVendorDetails";
      this.dynamicData.query = "select mat.Materialdescription as ItemName,mi.Itemid as ItemId,mi.Itemdetailsid as MPRItemDetailsid, vm.Vendorid as VendorId,mi.RevisionId as MPRRevisionId, mi.Quantity as MprQuantity,* from MPRVendorDetails mv inner join MPRItemInfo mi on mi.RevisionId=mv.RevisionId inner join MaterialMasterYGS mat on mat.Material = mi.itemid inner join  VendorMaster vm on vm.Vendorid = mv.Vendorid where mi.RevisionId = " + this.MPRRevisionId + "";
      this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
        this.vendorDetailsArray = data;
        if (this.totalRfqItems.length == 0) {
          this.totalRfqItems = data;
          this.mprVendors = true;
        }
        this.prepareRfQItems();
        this.getYILTermsAndConditions();
      })

    })
  }
  getYILTermsAndConditions() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select term.TermId,term.TermGroupId,term.Terms, CASE WHEN term.DefaultSelect = 0 THEN 'false' ELSE 'true' END AS DefaultSelect from yiltermsandconditions term left outer join MPRRevisions mpr on mpr.BuyerGroupId=term.BuyerGroupId or  term.BuyerGroupId is NULL where mpr.RevisionId = " + this.MPRRevisionId;
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.YILTermsAndConditions = data;
    })
  }
  openVendorDialog(dialogName: string) {
    this[dialogName] = true;
    this.vendorDetails = new MPRVendorDetail();
    this.selectedItem = new searchList();
  }

  dialogCancel(dialogName: string, openDialog: string) {
    this[dialogName] = false;
    this[openDialog] = true;
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
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId], updateColumns: item[this.constants[name].updateColumns]  };
        this.searchItems.push(value);
      });

      if (callback)
        callback();
    });
  }
  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    if (this.rfqQuoteModel.length > 0) {
      for (var i = 0; i < this.rfqQuoteModel.length; i++) {
        if ((this.vendorDetailsArray.filter(li => li.Vendorid == item.code).length > 0) || (this.rfqQuoteModel[i].suggestedVendorDetails.filter(li => li.VendorId == item.code).length > 0) || ((this.rfqQuoteModel[i].manualvendorDetails.filter(li => li.VendorId == item.code)).length > 0)) {
          alert("vendor already exist");
          break;
          return false;
        }
        else {
          this.showList = false;
          if (item.updateColumns && item.updateColumns != "NULL")
            this.newVendorDetails.Emailid = item.updateColumns;
          this.newVendorDetails.Vendorid = item.code;
          this.newVendor.controls['ContactNo'].clearValidators();
          this.newVendor.controls['VendorName'].clearValidators();
          this.newVendor.controls['ContactNo'].updateValueAndValidity();
          this.newVendor.controls['VendorName'].updateValueAndValidity();
          this.vendorDetails.Vendorid = item.code;
          this.vendorDetails.VendorName = item.name;
        }
      }
    }
    else {
      this.showList = false;
      if (item.updateColumns && item.updateColumns != "NULL")
        this.newVendorDetails.Emailid = item.updateColumns;
      this.newVendorDetails.Vendorid = item.code;
      this.newVendor.controls['ContactNo'].clearValidators();
      this.newVendor.controls['VendorName'].clearValidators();
      this.newVendor.controls['ContactNo'].updateValueAndValidity();
      this.newVendor.controls['VendorName'].updateValueAndValidity();
      this.vendorDetails.Vendorid = item.code;
      this.vendorDetails.VendorName = item.name;
    }
  }

  //vendor submit
  onVendorSubmit(dialogName: string, type: string) {
    if (type == "vendorDetails") {
      this.vendorSubmitted = true;
      if (this.newVendor.invalid) {
        return;
      }
      else {
        this.MprService.addNewVendor(this.newVendorDetails).subscribe(data => {
          this.vendorSubmitted = false;
          this.vendorDetailsArray = [];
          this.vendorDetails.Vendorid = data;
          if (this.newVendorDetails.VendorName)
          this.vendorDetails.VendorName = this.newVendorDetails.VendorName;
          this.vendorDetailsArray.push(this.vendorDetails);
          this.vendorDetailsArray.forEach((el) => { el.UpdatedBy = this.employee.EmployeeNo; })
          this.MprService.updateMPRVendor(this.vendorDetailsArray, this.MPRRevisionId).subscribe(data => {
            if (data) {
              this.dynamicData = new DynamicSearchResult();
              this.dynamicData.tableName = "MPRVendorDetails";
              this.dynamicData.searchCondition = "Where RevisionId=" + this.MPRRevisionId+""
              this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
                this.vendorDetailsArray = data;
              });
              //this.vendorDetailsArray = data;
              this[dialogName] = false;
              this.preapreManualRfqlist();
            }
          });
        });

      }
    }
  }

  //pepare top 3 Suggested vendors
  prepareRfQItems() {
    if (this.totalRfqItems.length > 0) {
      for (var i = 0; i < this.totalRfqItems.length; i++) {
        var res = this.rfqQuoteModel.filter(li => li.MPRItemDetailsid == this.totalRfqItems[i].MPRItemDetailsid);
        if (res.length == 0) {
          var rfqQuoteItems = new rfqQuoteModel();
          rfqQuoteItems.MPRItemDetailsid = this.totalRfqItems[i].MPRItemDetailsid;
          rfqQuoteItems.ItemId = this.totalRfqItems[i].ItemId;
          rfqQuoteItems.ItemName = this.totalRfqItems[i].ItemName;
          rfqQuoteItems.ItemDescription = this.totalRfqItems[i].ItemDescription;
          rfqQuoteItems.TargetSpend = this.totalRfqItems[i].TargetSpend;
          rfqQuoteItems.MprQuantity = this.totalRfqItems[i].MprQuantity;
          rfqQuoteItems.QuotationQty = this.totalRfqItems[i].QuotationQty;//rfqitems
          rfqQuoteItems.vendorQuoteQty = this.totalRfqItems[i].vendorQuoteQty;//rfqitemsinfo
          if (this.mprVendors) {
            rfqQuoteItems.manualvendorDetails = this.totalRfqItems.filter(li => li.MPRItemDetailsid == this.totalRfqItems[i].MPRItemDetailsid);
          }
          else {
            rfqQuoteItems.suggestedVendorDetails = this.totalRfqItems.filter(li => li.MPRItemDetailsid == this.totalRfqItems[i].MPRItemDetailsid);
            rfqQuoteItems.suggestedVendorDetails = rfqQuoteItems.suggestedVendorDetails.slice(0, 3);
          }
          this.rfqQuoteModel.push(rfqQuoteItems);
        }
      }
    }
  }

  preapreManualRfqlist() {
    for (var i = 0; i < this.rfqQuoteModel.length; i++) {
      if (this.rfqQuoteModel[i].suggestedVendorDetails.filter(li => li.VendorId == this.vendorDetails.Vendorid).length > 0) {
        this.rfqQuoteModel[i].manualvendorDetails.push(this.rfqQuoteModel[i].suggestedVendorDetails.filter(li => li.VendorId == this.vendorDetails.Vendorid)[0]);
      }
      else {
        let manualdetails = new Object();
        manualdetails["MPRItemDetailsid"] = this.rfqQuoteModel[i].MPRItemDetailsid;
        manualdetails["MPRRevisionId"] = this.MPRRevisionId;
        manualdetails["ItemId"] = this.rfqQuoteModel[i].ItemId;
        manualdetails["ItemName"] = this.rfqQuoteModel[i].ItemName;
        manualdetails["VendorId"] = this.vendorDetails.Vendorid;
        manualdetails["VendorName"] = this.vendorDetails.VendorName;
        manualdetails["UnitPrice"] = "-";
        manualdetails["vendorQuoteQty"] = "-";
        manualdetails["Discount"] = "-";
        manualdetails["PaymentTermCode"] = "-"

        this.rfqQuoteModel[i].manualvendorDetails.push(manualdetails)
      }
    }
  }

  selectVendorList(event: any, itemsIndex: number, vendorIndex: number, id: string, vendor: any, checked: boolean) {
    var qty = (<HTMLInputElement>document.getElementById(id + itemsIndex + "" + vendorIndex)).value;
    id == "SQty" ? this.rfqQuoteModel[itemsIndex].suggestedVendorDetails[vendorIndex].QuotationQty = qty : this.rfqQuoteModel[itemsIndex].manualvendorDetails[vendorIndex].QuotationQty = qty;
    if (checked) {
      var index = this.selectedVendorList.findIndex(x => x.RFQItemsId == vendor.RFQItemsId);
      if (event.currentTarget.checked)
        this.selectedVendorList.push(vendor);
      else
        this.selectedVendorList.splice(index, 1);
    }
  }

  //Conforamtion Data
  prepareVendorMatrix() {
    this.cols = [];
    for (var i = 0; i < this.rfqQuoteModel.length; i++) {

      this.rfqQuoteModel[i].suggestedVendorDetails.forEach(vendor => {
        if (this.cols.filter(li => li.VendorId == vendor.VendorId).length == 0) {
          var object = { ItemId: vendor.ItemId, VendorName: vendor.VendorName, VendorId: vendor.VendorId };
          this.cols.push(object);
        }
      });
      this.rfqQuoteModel[i].manualvendorDetails.forEach(vendor => {
        if (this.cols.filter(li => li.VendorId == vendor.VendorId).length == 0) {

          var object = { ItemId: vendor.ItemId, VendorName: vendor.VendorName, VendorId: vendor.VendorId, };
          this.cols.push(object);
        }
      })
    }

  }

  bindCheckeMark(vendor: any, MPRItemDetailsid: number) {
    return this.selectedVendorList.filter(li => (li.VendorId == vendor.VendorId) && (li.MPRItemDetailsid == MPRItemDetailsid)).length > 0 ? true : false;

  }

  openrevisionDialog() {
    this.showConformationDialog = false;
    this.showRevisionsDialog = true;
  }

  openConformDialog() {
    if (this.selectedVendorList.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select atlest one vendor' });
      return;
    }
    this.prepareVendorMatrix();
    this.showConformationDialog = true;

  }
  termChange(event: any, index: number) {
    this.YILTermsAndConditions[index].DefaultSelect = event.target.checked
  }

  onVendorQuoteUpdate() {
    var date = new Date();
    if (this.RFQRevisionData.RfqValidDate)
      date.setDate(date.getDate() + parseInt(this.RFQRevisionData.RfqValidDate.toString()));
    else
      date.setDate(date.getDate() + this.constants.rfqValidDays);
    this.selectedVendorList.forEach(item => {
      item.CreatedBy = this.employee.EmployeeNo;
      item.CreatedDate = new Date();
      item.RfqValidDate = new Date(date);
      item.PackingForwading = this.RFQRevisionData.PackingForwading;
      item.ExciseDuty = this.RFQRevisionData.ExciseDuty;
      item.salesTax = this.RFQRevisionData.salesTax;
      item.freight = this.RFQRevisionData.freight;
      item.Insurance = this.RFQRevisionData.Insurance;
      item.CustomsDuty = this.RFQRevisionData.CustomsDuty;
      item.PaymentTermDays = this.RFQRevisionData.PaymentTermDays;
      item.PaymentTermRemarks = this.RFQRevisionData.PaymentTermRemarks;
      item.BankGuarantee = this.RFQRevisionData.BankGuarantee;
      item.DeliveryMinWeeks = this.RFQRevisionData.DeliveryMinWeeks;
      item.DeliveryMaxWeeks = this.RFQRevisionData.DeliveryMaxWeeks;
    });
    this.YILTermsAndConditions.forEach((el) => { el.CreatedBy = this.employee.EmployeeNo; })
    this.RfqService.updateVendorQuotes(this.selectedVendorList, this.YILTermsAndConditions).subscribe(data => {
      if (data) {
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Updated sucessfully' });
        this.showRevisionsDialog = false;
        this.router.navigate(["/SCM/RFQComparision", this.MPRRevisionId]);
      }
    })
  }

  showVendorClick() {
    this.newVendorDetails.Vendorid = 0;
    this.newVendor.controls['VendorName'].setValidators([Validators.required]);
    this.newVendor.controls['ContactNo'].setValidators([Validators.required]);
  }
}


