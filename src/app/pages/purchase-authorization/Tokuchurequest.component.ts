import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee, DynamicSearchResult, MPRItemInfoes, searchList, materialUpdate } from '../../Models/mpr';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { constants } from 'src/app/Models/MPRConstants';
import { mprpadetailsmodel, VendorMasterModel, TokuchuRequest, TokuchuLIneItem, ItemsViewModel } from 'src/app/Models/PurchaseAuthorization'
import { MprService } from 'src/app/services/mpr.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-tokuchu',
  templateUrl: './TokuchuRequest.component.html',
})

export class TokuchuRequestComponent implements OnInit {
  public paid: number;
  public TokuchRequestid: number;
  public employee: Employee;
  public MPRItemDetailsForm: FormGroup;
  public purchasedetails: mprpadetailsmodel;
  public vendor: Array<VendorMasterModel> = [];
  public MPRItemDetailsid: any[];
  public selectedItems: Array<any> = [];
  public selectedvendor: string;
  public finalpaymentterm: string;
  public vendorname: string;
  public tokuchuRequest: TokuchuRequest;
  public tokuchuLineItem: TokuchuLIneItem;
  public VerifiedBy: string;
  public statusList: Array<any> = [];
  public EmpList: Array<any> = [];
  public verifyEmpList: Array<any> = [];
  public dynamicData = new DynamicSearchResult();
  public ProductCategory1List: Array<any> = [];
  public ProductCategory2List: Array<any> = [];
  public ProductCategory2filterList: Array<any> = [];
  public ProductCategorylevel1id; ProductCategorylevel2id: number = null;
  public displayItemDialog; showCatDialog: boolean = false;
  public itemDetails: materialUpdate;
  public showList: boolean = false;
  public selectedlist: Array<searchList> = [];
  public formName: string = "Acknowledge";
  public txtName: string;
  public searchItems: Array<searchList> = [];
  public searchresult: Array<object> = [];
  public selectedItem: searchList;
  public rowIndx: number;
  public showSubmit; showPreverSts; showverSts: boolean = false;
  public enableEdit: boolean = true;

  constructor(private paService: purchaseauthorizationservice, public MprService: MprService, private router: Router, public messageService: MessageService, public constants: constants, private spinner: NgxSpinnerService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.purchasedetails = new mprpadetailsmodel();
    this.MPRItemDetailsid = new Array<any>();
    this.selectedItems = new Array<any>();
    this.tokuchuRequest = new TokuchuRequest();
    this.itemDetails = new materialUpdate();
    this.MPRItemDetailsForm = this.formBuilder.group({
      ItemId: ['', [Validators.required, this.noWhitespaceValidator]],
    });

    this.paid = JSON.parse(localStorage.getItem("paid"));
    this.route.params.subscribe(params => {
      if (params["TokuchRequestid"])
        this.TokuchRequestid = params["TokuchRequestid"];
      if (this.TokuchRequestid)
        this.paid = 0;
    });
    this.getStatusList();
    this.getEmplist();
    this.getcat1List();
    this.getcat2List();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.formName = formName;
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    searchTxt = searchTxt.replace('*', '%');
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    if (this.dynamicData.searchCondition && name == "ItemId")
      this.dynamicData.searchCondition += " OR Material" + " like '%" + searchTxt + "%'" + "group by Material";
    this.dynamicData.searchCondition += " Order By " + this.constants[name].fieldName + "";
    if (name == "ItemId")
      this.dynamicData.query = "select Material,MAX(Materialdescription) as Materialdescription from MaterialMasterYGS left join RFQItems_N on RFQItems_N.ItemId =MaterialMasterYGS.Material left join RFQRevisions_N on RFQRevisions_N.rfqRevisionId =RFQItems_N.RFQRevisionId" + this.dynamicData.searchCondition + " ";
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
        if (name == "ItemId") {
          fName = item[this.constants[name].fieldName] + " - " + item[this.constants[name].fieldId];
        }
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId] };
        this.searchItems.push(value);
      });

      this.selectedItem = this.searchItems.filter(li => li.code == this.itemDetails[name])[0];
      if (callback)
        callback();
    });
  }

  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;

    if (this.formName != "") {
      this[this.formName].controls[this.txtName].setValue(item.name);
      if (item.listName == "ItemId") {
        this.itemDetails.Itemid = item.code;
        this.itemDetails.Materialdescription = item.name;
      }

    }
    this[this.formName].controls[this.txtName].updateValueAndValidity()
  }

  //clear model when search text is empty
  onsrchTxtChange(modelparm: string, model: string) {
    //if (value == "") {
    this[model][modelparm] = "";
    //}
  }


  getEmplist() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select EmployeeNo,Name,OrgDepartmentId from employee where DOL is null";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.EmpList = data
      this.verifyEmpList = this.EmpList.filter(li => li.OrgDepartmentId == 14);
    })
  }
  getcat1List() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select P1CategoryId,CategoryName from ProductCategory1 where Deleteflag!=1 order by OrderIndex";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.ProductCategory1List = data;
    })
  }

  getcat2List() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select p2CategoryId,P1CategoryId,SubCategoryName from ProductCategory2 where Deleteflag!=1 order by OrderIndex";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.ProductCategory2List = data;
      this.ProductCategory2filterList = data;
      this.getmprpabyid(this.paid);
    })
  }

  getStatusList() {
    this.MprService.getStatusList().subscribe(data => {
      this.statusList = data;
    })
  }

  LoadVendorbymprdeptids(MPRItemDetailsid: any) {
    var distinct = [];
    this.paService.LoadVendorbymprdeptids(MPRItemDetailsid).subscribe(data => {
      this.vendor = data;
    })
  }


  getmprpabyid(paid: any) {
    this.paService.GetTokuchuDetailsByPAID(paid, this.TokuchRequestid).subscribe(data => {
      this.purchasedetails = data;
      this.purchasedetails.Item.forEach(data => {
        if (this.ProductCategory2List.filter(li => li.p2CategoryId == data["ProductCategorylevel2id"]).length > 0) {
          var res = this.ProductCategory2List.filter(li => li.p2CategoryId == data["ProductCategorylevel2id"])[0];
          data['ProductCategorylevel1id'] = res.P1CategoryId;
          data['ProductCategorylevel1Name'] = this.ProductCategory1List.filter(li => li.P1CategoryId == res.P1CategoryId)[0].CategoryName;
          data['ProductCategorylevel2Name'] = res.SubCategoryName;
        }
      })

      this.preparetokuchuData();
      this.selectedvendor = this.purchasedetails.Item[0]["VendorName"];
      this.finalpaymentterm = this.purchasedetails.Item[0]["PaymentTermCode"];
      for (var i = 0; i < this.purchasedetails.Item.length; i++) {
        this.MPRItemDetailsid.push(this.purchasedetails.Item[i]["MRPItemsDetailsID"]);
      }
      this.LoadVendorbymprdeptids(this.MPRItemDetailsid);
      this.bindStatus();
    },
      (error) => {
        console.error("Error: " + JSON.stringify(error));
      });
  }

  preparetokuchuData() {
    this.tokuchuRequest = new TokuchuRequest();
    if (this.purchasedetails.TokuchuRequest) {
      this.tokuchuRequest.TokuchRequestid = this.purchasedetails.TokuchuRequest.TokuchRequestid;;
      this.tokuchuRequest.PAId = this.purchasedetails.TokuchuRequest.PAId;
      this.tokuchuRequest.PreparedBY = this.purchasedetails.TokuchuRequest.PreparedBY;
      this.tokuchuRequest.Preparedon = this.purchasedetails.TokuchuRequest.Preparedon;
      this.tokuchuRequest.PreVerifiedBy = this.tokuchuRequest.VerifiedBy = this.purchasedetails.TokuchuRequest.VerifiedBy;
      this.tokuchuRequest.PreVerifiedOn = this.purchasedetails.TokuchuRequest.PreVerifiedOn;
      this.tokuchuRequest.PreVerifiedStatus = this.purchasedetails.TokuchuRequest.PreVerifiedStatus;
      this.tokuchuRequest.PreVerifiedRemarks = this.purchasedetails.TokuchuRequest.PreVerifiedRemarks;
      this.tokuchuRequest.VerifiedOn = this.purchasedetails.TokuchuRequest.VerifiedOn;
      this.tokuchuRequest.VerifiedStatus = this.purchasedetails.TokuchuRequest.VerifiedStatus;
      this.tokuchuRequest.VerifiedRemarks = this.purchasedetails.TokuchuRequest.VerifiedRemarks;
      this.tokuchuRequest.DownloadedBy = this.purchasedetails.TokuchuRequest.DownloadedBy;
      this.tokuchuRequest.DownloadedOn = this.purchasedetails.TokuchuRequest.DownloadedOn;
      this.tokuchuRequest.CompletedStatus = this.purchasedetails.TokuchuRequest.CompletedStatus;
      this.tokuchuRequest.CompletedOn = this.purchasedetails.TokuchuRequest.CompletedOn;
      this.tokuchuRequest.TokuchuProcessTracks = this.purchasedetails.TokuchuRequest.TokuchuProcessTracks;
    }
  }

  selectItem(details: any, event: any) {
    var index = this.selectedItems.findIndex(x => x.paitemid == details.paitemid);
    if (details.materialid.indexOf('BOP1') <= -1) {
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: "Select BOP1 Items" });
      (<HTMLInputElement>document.getElementById("item" + details.paitemid)).checked = false;
      if (index > -1)
        this.selectedItems.splice(index, 1);
      return;
    }
    var errorText = "";
    if (event.currentTarget.checked) {
      if (!details.MfgModelNo || !details.MfgPartNo || !details.VendorModelNo || !details.ManufacturerName) {
        if (!details.MfgModelNo)
          errorText += "MfgModelNo";
        if (!details.MfgPartNo)
          errorText += " " + "MfgPartNo";
        if (!details.VendorModelNo)
          errorText += " " + "VendorModelNo";
        if (!details.ManufacturerName)
          errorText += " " + "ManufacturerName";
        errorText += " " + "Fields need to be fill.";
        (<HTMLInputElement>document.getElementById("item" + details.paitemid)).checked = false;
        this.messageService.add({ severity: 'error', summary: 'Validation', detail: errorText });
        if (index > -1)
          this.selectedItems.splice(index, 1);
      }
      else {
        this.selectedItems.push(details);
      }
    }
    else {
      if (index > -1)
        this.selectedItems.splice(index, 1);
    }

  }

  bindStatus() {
    if (!this.tokuchuRequest.PreVerifiedBy && !this.tokuchuRequest.VerifiedBy) {
      this.showSubmit = true;
    }
    else if (this.tokuchuRequest.PreVerifiedBy && this.tokuchuRequest.VerifiedBy && this.tokuchuRequest.PreVerifiedBy != this.employee.EmployeeNo && this.tokuchuRequest.PreparedBY == this.employee.EmployeeNo) {
      if (this.tokuchuRequest.PreVerifiedStatus != 'Approved') {
        this.showSubmit = true;
      }
      else {
        this.showSubmit = false;
      }
    }

    else if (this.tokuchuRequest.PreVerifiedBy == this.employee.EmployeeNo && this.tokuchuRequest.PreVerifiedStatus != 'Approved') {
      this.showPreverSts = true;
    }
    else if (this.tokuchuRequest.VerifiedBy == this.employee.EmployeeNo && this.tokuchuRequest.VerifiedStatus != 'Approved') {
      this.showverSts = true;
    }
  }
  ProductCategorylevel1change(ProductCategorylevel1id: any) {
    this.ProductCategorylevel2id = null;
    this.ProductCategory2filterList = this.ProductCategory2List.filter(li => li.P1CategoryId == ProductCategorylevel1id);

  }

  showMaterialDialog(rowIndex: number, MRPItemsDetailsID: any) {
    this.displayItemDialog = true;
    this.itemDetails.Itemdetailsid = MRPItemsDetailsID;
    this.rowIndx = rowIndex;
  }

  dialogCancel(dialogName) {
    this[dialogName] = false;
  }

  //Add category Levels
  AddCategoryLevels(index: any) {
    this.showCatDialog = true;
    this.ProductCategorylevel1id = this.ProductCategorylevel2id = null;
    this.rowIndx = index;

  }
  addCatLevels() {
    if (!this.ProductCategorylevel1id) {
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Select category level1' });
      return true;
    }
    if (!this.ProductCategorylevel2id) {
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Select category level2' });
      return true;
    }
    this.purchasedetails.Item[this.rowIndx]['ProductCategorylevel1id'] = this.ProductCategorylevel1id;
    this.purchasedetails.Item[this.rowIndx]['ProductCategorylevel2id'] = this.ProductCategorylevel2id;
    this.purchasedetails.Item[this.rowIndx]['ProductCategorylevel1Name'] = this.ProductCategory1List.filter(li => li.P1CategoryId == this.ProductCategorylevel1id)[0].CategoryName;
    this.purchasedetails.Item[this.rowIndx]['ProductCategorylevel2Name'] = this.ProductCategory2filterList.filter(li => li.p2CategoryId == this.ProductCategorylevel2id)[0].SubCategoryName;
    this.showCatDialog = false;
  }

  materialidUpdate() {
    this.itemDetails.RFQItemsId = this.purchasedetails.Item[this.rowIndx]["RFQItemsId"];
    this.itemDetails.MPRRevisionId = this.purchasedetails.Item[this.rowIndx]["MPRRevisionId"];

    this.MprService.updateItemId(this.itemDetails).subscribe(data => {
      if (data) {
        this.displayItemDialog = false;
        this.purchasedetails.Item[this.rowIndx]["materialid"] = this.itemDetails.Itemid;
        this.purchasedetails.Item[this.rowIndx]["Materialdescription"] = this.itemDetails.Materialdescription;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Item id Updated' });
      }

    })
  }

  submitTokuchuRequest() {
    var typeOfuser = "Requestor";
    var errormessage = "";
    if (this.selectedItems.length == 0 && this.showSubmit) {
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Select atleast one item' });
      return;
    }
    this.tokuchuRequest.TokuchRequestid = this.purchasedetails.TokuchuRequest.TokuchRequestid;;
    this.tokuchuRequest.PAId = this.paid;
    this.tokuchuRequest.PreparedBY = this.employee.EmployeeNo;
    //this.tokuchuRequest.PreVerifiedBy = this.tokuchuRequest.VerifiedBy;
    this.tokuchuRequest.PreVerfiedBY = this.tokuchuRequest.VerifiedBy;
    if (this.showPreverSts) {
      this.tokuchuRequest.PreVerifiedOn = new Date();
      typeOfuser = "PreVerifier";
    }
    if (this.showverSts) {
      this.tokuchuRequest.VerifiedOn = new Date();
      typeOfuser = "Verifier";
    }
    this.tokuchuRequest.TokuchuLIneItems = [];
    this.selectedItems.forEach((item, index) => {
      this.tokuchuLineItem = new TokuchuLIneItem();
      this.tokuchuLineItem.Tklineitemid = item.Tklineitemid;
      this.tokuchuLineItem.TokuchRequestid = this.tokuchuRequest.TokuchRequestid;
      this.tokuchuLineItem.PAItemID = item.paitemid;
      this.tokuchuLineItem.StandardLeadtime = item.StandardLeadtime;
      if (!item.ProductCategorylevel2id) {
        errormessage += (index + 1) + ","
      }
      this.tokuchuLineItem.ProductCategorylevel2id = item.ProductCategorylevel2id;
      this.tokuchuLineItem.updatedby = this.employee.EmployeeNo;
      this.tokuchuRequest.TokuchuLIneItems.push(this.tokuchuLineItem);
    })
    if (errormessage) {
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Select category level2 at selected item ' + errormessage + '' });
      return true;
    }
    this.spinner.show();
    this.paService.updateTokuchuRequest(this.tokuchuRequest, typeOfuser, this.purchasedetails.Item[0]["MPRRevisionId"]).subscribe(data => {
      this.spinner.hide();
      if (data) {
        this.tokuchuRequest.TokuchRequestid = data;
        var text = "Request Submitted";
        if (this.tokuchuRequest.PreVerifiedStatus == 'Approved' && this.showPreverSts) {
          this.showPreverSts = false;
          text = "Status Updated";
        }
        if (this.tokuchuRequest.VerifiedStatus == 'Approved' && this.showverSts) {
          text = "Status Updated";
          this.showverSts = false;
        }

        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: text });
      }
    });

  }

  getEmpName(empno: any) {
    if (empno && this.EmpList.length > 0 && this.EmpList.filter(li => li.EmployeeNo == empno)[0])
      return this.EmpList.filter(li => li.EmployeeNo == empno)[0].Name;
  }
}
