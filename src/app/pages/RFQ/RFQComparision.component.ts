import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { RfqService } from 'src/app/services/rfq.service ';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { rfqQuoteModel, VendorDetails, rfqTerms } from 'src/app/Models/rfq';
import { Employee } from 'src/app/Models/mpr';

@Component({
  selector: 'app-RFQComparision',
  templateUrl: './RFQComparision.component.html',
})

export class RFQComparisionComponent implements OnInit {
  constructor(public RfqService: RfqService, public MprService: MprService, public constants: constants, private route: ActivatedRoute, private router: Router, private messageService: MessageService) { }

  //variable Declarations
  public employee: Employee;
  public MPRRevisionId: number;
  public selectedVendorList: Array<any> = [];
  public RfqCompareItems: Array<any> = [];
  public rfqTermsList: Array<any> = [];
  public rfqQuoteModel: Array<rfqQuoteModel> = [];
  public vendorDetails: VendorDetails;
  public cols: any[];
  public status: string;
  public statusList: Array<any> = [];
  public termCols: Array<rfqTerms>=[]
  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");

    this.route.params.subscribe(params => {
      if (params["MPRRevisionId"]) {
        this.MPRRevisionId = params["MPRRevisionId"];
        this.getRFQCompareItemsById();
      }
    });
  }
  getRFQCompareItemsById() {
    this.RfqService.getRFQCompareItems(this.MPRRevisionId).subscribe(data => {
      this.RfqCompareItems = data["CompareTable"];
      this.rfqTermsList = data["RfqtermsTable"];
      this.prepareRfQItems();
      if (this.rfqTermsList.length > 0)
        this.prepareTermNames();
    })
  }

  //pepare top 3 Suggested vendors
  prepareRfQItems() {
    this.prepareColsData();
    this.prepareTermNames();
    for (var i = 0; i < this.RfqCompareItems.length; i++) {
      var res = this.rfqQuoteModel.filter(li => li.ItemId == this.RfqCompareItems[i].ItemId);
      if (res.length == 0) {
        var rfqQuoteItems = new rfqQuoteModel();
        rfqQuoteItems.MPRItemDetailsid = this.RfqCompareItems[i].MPRItemDetailsid;
        rfqQuoteItems.ItemId = this.RfqCompareItems[i].ItemId;
        rfqQuoteItems.ItemName = this.RfqCompareItems[i].ItemName;
        rfqQuoteItems.ItemDescription = this.RfqCompareItems[i].ItemDescription;
        rfqQuoteItems.TargetSpend = this.RfqCompareItems[i].TargetSpend;
        rfqQuoteItems.QuotationQty = this.RfqCompareItems[i].QuotationQty;//rfqitems
        rfqQuoteItems.vendorQuoteQty = this.RfqCompareItems[i].vendorQuoteQty;//rfqitemsinfo
        rfqQuoteItems.UnitPrice = this.RfqCompareItems[i].UnitPrice;//rfqitemsinfo
        rfqQuoteItems.RfqDocStatus = this.RfqCompareItems[i].RfqDocStatus;//rfqdocuments
        this.cols.forEach(vendor => {
          this.vendorDetails = new VendorDetails();
          if (this.RfqCompareItems.filter(li => li.VendorId == vendor.VendorId && li.ItemId == this.RfqCompareItems[i].ItemId)[0])
            this.vendorDetails = this.RfqCompareItems.filter(li => li.VendorId == vendor.VendorId && li.ItemId == this.RfqCompareItems[i].ItemId)[0];
          else {
            this.createEmptyVendor();
          }
          rfqQuoteItems.suggestedVendorDetails.push(this.vendorDetails);
        });
        //rfqQuoteItems.suggestedVendorDetails = this.RfqCompareItems.filter(li => li.ItemId == this.RfqCompareItems[i].ItemId);
        rfqQuoteItems.leastPrice = Math.min.apply(Math, rfqQuoteItems.suggestedVendorDetails.filter(li => li.UnitPrice != null).map(function (o) { return o.UnitPrice; }));
        this.rfqQuoteModel.push(rfqQuoteItems);
      }
    }

  }

  prepareTermNames() {
    this.rfqTermsList.forEach(item => {
      var rfqTermObj = new rfqTerms();
      if (this.termCols.filter(li => li.Terms == item.Terms).length == 0) {
        if (this.termCols.filter(li => li.RFQrevisionId == item.RFQrevisionId).length == 0) {
          rfqTermObj.Terms = item.Terms;
          rfqTermObj.RFQrevisionId = item.RFQrevisionId;
          rfqTermObj.Remarks = item.Remarks;
          rfqTermObj.VendorResponse = item.VendorResponse;
          rfqTermObj.termsList = this.rfqTermsList.filter(li => li.Terms == item.Terms)
          this.termCols.push(rfqTermObj);
        }
      }     
    });
  }

  getTerm(revisionId, term: rfqTerms) {
    var termRes = this.rfqTermsList.filter(li => li.RFQrevisionId == revisionId && li.Terms == term.Terms)[0];
    if (termRes.VendorResponse)
      return termRes.VendorResponse;
    else
      return "";
  }
  getRemarks(revisionId, term: rfqTerms) {
    return this.rfqTermsList.filter(li => li.RFQrevisionId == revisionId && li.Terms == term.Terms)[0].Remarks;
  }
  createEmptyVendor() {
    this.vendorDetails.VendorCode = "";
    this.vendorDetails.VendorName = "";
    this.vendorDetails.OldvendorCode = "";
    this.vendorDetails.RFQNo = "";
    this.vendorDetails.MPRRevisionId = "";
    this.vendorDetails.RfqMasterId = "";
    this.vendorDetails.VendorId = null;
    this.vendorDetails.rfqRevisionId = 0;
    this.vendorDetails.RFQValidDate = new Date();
    this.vendorDetails.DeliveryMinWeeks = 0;
    this.vendorDetails.DeliveryMaxWeeks = 0;
    this.vendorDetails.RFQItemsId = 0;
    this.vendorDetails.MPRItemsDetailsId = 0;
    this.vendorDetails.VendorQuoteQty = "";
    this.vendorDetails.UnitPrice = null;
    this.vendorDetails.DiscountPercentage = "";
    this.vendorDetails.Discount = "";
    this.vendorDetails.PaymentTermDays = 0;
    this.vendorDetails.PaymentTermRemarks = "";
    this.vendorDetails.BankGuarantee = "";
    this.vendorDetails.Freight = "";
    this.vendorDetails.Insurance = "";

  }
  //Conforamtion Data
  prepareColsData() {
    this.cols = [];
    this.RfqCompareItems.forEach(vendor => {
      if (this.cols.filter(li => li.VendorId == vendor.VendorId).length == 0) {
        this.cols.push(vendor);
      }
    });
  }

  selectVendorList(event: any, vendor: any, rowindex: any, vendorIndex: any, checkAll: boolean) {
    this.statusList = []
    this.status = "";
    if (!checkAll) {
      var index = this.selectedVendorList.findIndex(x => x.RFQItemsId == vendor.RFQItemsId);
      if (index < 0 && event.target.checked == true) {
        this.selectedVendorList.push(vendor);
        const totalQty = this.selectedVendorList.filter(li => li.ItemId == vendor.ItemId).reduce((sum, item) => sum + item.vendorQuoteQty, 0);
        if (totalQty > vendor.QuotationQty && (this.selectedVendorList.filter(li => li.ItemId == vendor.ItemId).length > 1)) {
          this.statusList.push(rowindex + 1);
          event.target.checked = false;
          this.selectedVendorList.splice(index, 1);
          if ((this.selectedVendorList.filter(x => x.VendorId == vendor.VendorId)).length == 0)
            (<HTMLInputElement>document.getElementById("vendor" + vendorIndex)).checked = false;
          return;
        }
      }
      else {
        this.selectedVendorList.splice(index, 1);
        if ((this.selectedVendorList.filter(x => x.VendorId == vendor.VendorId)).length == 0)
          (<HTMLInputElement>document.getElementById("vendor" + vendorIndex)).checked = false;
      }
    }
    else {
      let index = 0;
      this.rfqQuoteModel.forEach((item, rowIndex: number) => {
        var itmVendor = item.suggestedVendorDetails[vendorIndex];
        var checked = (<HTMLInputElement>document.getElementById("ven" + rowIndex + "" + vendorIndex)).checked;
        index = this.selectedVendorList.findIndex(x => x.RFQItemsId == itmVendor.RFQItemsId);
        if (itmVendor && itmVendor.VendorId == vendor.VendorId && index < 0 && event.target.checked == true && checked == false) {
          (<HTMLInputElement>document.getElementById("ven" + rowIndex + "" + vendorIndex)).checked = true;
          this.selectedVendorList.push(itmVendor);
          const totalQty = this.selectedVendorList.filter(li => li.ItemId == itmVendor.ItemId).reduce((sum, item) => sum + item.vendorQuoteQty, 0);
          if (totalQty > item.QuotationQty && (this.selectedVendorList.filter(li => li.ItemId == itmVendor.ItemId).length > 1)) {
            this.statusList.push(rowindex + 1);
            (<HTMLInputElement>document.getElementById("ven" + rowIndex + "" + vendorIndex)).checked = false;
            event.target.checked = false;
            index = this.selectedVendorList.findIndex(x => x.RFQItemsId == itmVendor.RFQItemsId);
            if (index >= 0)
              this.selectedVendorList.splice(index, 1);
            //return;
          }
        }
        else {
          index = this.selectedVendorList.findIndex(x => x.RFQItemsId == itmVendor.RFQItemsId);
          if (index >= 0)
            this.selectedVendorList.splice(index, 1);
          (<HTMLInputElement>document.getElementById("ven" + rowIndex + "" + vendorIndex)).checked = false;
        }
      })
    }
    if (this.statusList.length > 0)
      this.status = " Quantity Exceeded at row number " + " " + this.statusList.toString();

  }

  calculateTotalPrice(colIndex: any) {
    let totalPrice: number = 0;
    this.rfqQuoteModel.forEach(item => {
      if (item.suggestedVendorDetails[colIndex])
        totalPrice += item.suggestedVendorDetails[colIndex].UnitPrice;
    });
    return totalPrice;
  }

  statusSubmit() {
    if (this.selectedVendorList.length > 0) {
      this.selectedVendorList.forEach((el) => { el.CreatedBy = this.employee.EmployeeNo; })
      this.RfqService.statusUpdate(this.selectedVendorList).subscribe(data => {
        if (data)
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Status Updated sucessfully' });
      })
    }
    else
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select at leat one item' });
  }
}


