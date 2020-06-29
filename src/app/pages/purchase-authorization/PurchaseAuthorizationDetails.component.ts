import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { PADetailsModel, ItemsViewModel, EmployeeModel, ProjectManager } from 'src/app/Models/PurchaseAuthorization'
import { MPRVendorDetail, DynamicSearchResult, searchList, mprRevision, MPRItemInfoes, MPRBuyerGroup, Employee, Department } from 'src/app/Models/mpr'
import { constants } from 'src/app/Models/MPRConstants'
import { MprService } from 'src/app/services/mpr.service';
import { Router, ActivatedRoute} from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-purchaseAuthorizationDetails',
    templateUrl: './purchaseAuthorizationDetails.component.html',
})
export class PurchaseAuthorizationDetailsComponent implements OnInit {
    selectedItems1 = [];

    constructor(public paService: purchaseauthorizationservice, public messageservice: MessageService,public constants: constants, public mprservice: MprService, private routing: Router, private activeroute: ActivatedRoute) {

    }
    public hivalue = true;
    public Vendorid: number;
    public approvevalue = false;
    //public checked: boolean;
    public MPRPageForm1: FormGroup;
    public disableSubmit: boolean = true;
    public department: Department;
    public buyergroups: MPRBuyerGroup;
    public projectmanger: ProjectManager;
    public padetails: PADetailsModel;
    public employee: EmployeeModel[];
    public paitemdetails: Array<ItemsViewModel> = [];
    public paitem: ItemsViewModel;
    public vendorDetails: MPRVendorDetail;
    public itemDetails: MPRItemInfoes;
    public txtName: string;
    public dynamicData = new DynamicSearchResult();
    public searchresult: Array<object> = [];
    public searchItems: Array<searchList> = [];
    public showList: boolean = false;
    public selectedlist: Array<searchList> = [];
    public selectedItem: searchList;
    public formName: string;
    public mprRevisionModel: mprRevision;
    public dialogTop: string;
    public multiSelect: boolean = true;
    public vendorSubmitted; MPRForm1Submitted; Departmentsubmittted; projectmangersubmitted;
    public selectedbox: any[];
    public selectedItems: Array<any> = [];
    public VendorName: string;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.routing.navigateByUrl("Login");
        }
        this.padetails = new PADetailsModel();
        this.vendorDetails = new MPRVendorDetail();
        this.buyergroups = new MPRBuyerGroup();
        this.projectmanger = new ProjectManager();

       
            this.activeroute.params.subscribe(params => {
                if (params["RevisionId"]) {
                    this.padetails.RevisionID = params["RevisionId"];
                    this.displayitems(this.padetails);
                }
                else {

                }
            })
        

        //this.checked = false;
    }
    displayitems(padetails: PADetailsModel) {
        this.paService.LoadItems(padetails).subscribe(data => {
            //this.paitemdetails[0].itemsum = data[0].QuotationQty * data[0].UnitPrice;
            this.paitemdetails = data;
            if (this.paitemdetails.length) {
                for (var i = 0; i < this.paitemdetails.length; i++) {
                    this.paitemdetails[i].itemsum = this.paitemdetails[i].QuotationQty * this.paitemdetails[i].UnitPrice;
                }
            }
            else {
                //alert("No items")
                this.messageservice.add({ severity: 'info', summary: 'Alert Message', detail: 'No Items', });
            }
        })
    }
    public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
        this.dialogTop = e.clientY + 30 + "px";
        this.txtName = name;
        if (searchTxt == undefined)
            searchTxt = "";
        this.dynamicData.tableName = this.constants[name].tableName;
        this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
        this.dynamicData.searchCondition += " Order By " + this.constants[name].fieldName + "";
        this.mprservice.GetListItems(this.dynamicData).subscribe(data => {
            if (data.length == 0)
                this.showList = false;
            else
                this.showList = true;
            this.searchresult = data;
            this.searchItems = [];
            var fName = "";
            this.searchresult.forEach(item => {

                if (name == "venderid")
                    fName = item[this.constants[name].fieldName] + " - " + item["VendorCode"];
                //else if
                //    fName = item[this.constants[name].fieldname] + " - " + item[""]
                else
                    fName = item[this.constants[name].fieldName];
                var value = { listName: name, name: fName, code: item[this.constants[name].fieldId] };
                this.searchItems.push(value);
            });
            //if (this.selectedItem.name == null) {
            //    var list = this.selectedlist.filter(li => li.listName == name);
            //    if (list.length > 0)
            //        this.selectedItem = this.searchItems.filter(li => li.code == list[0].code)[0];
            //}
            //if (this.mprRevisionModel[name] != null)
            //    this.selectedItem = this.searchItems.filter(li => li.code == this.mprRevisionModel[name])[0];
            //if (callback)
            //    callback();
        });
    }
    dialogCancel(dialogName) {
        this[dialogName] = false;
    }
    selectAll(itemsview: ItemsViewModel[], event) {

        if (event.target.checked) {

        }
        this.paitemdetails.forEach(item => item.selectAll = event.target.checked)
        for (var i = 0; i < this.paitemdetails.length; i++) {
            this.selectedItems.push(itemsview)
        }
        this.selectedItems.push(itemsview);
    }
    //displayapproveitems() {

    //    console.log(this.selectedItems);
    //    let obj;
    //    let itemarray = [];
    //    if (this.selectedItems.length > 0) {
    //        this.hivalue = false;
    //        this.selectedItems.reduce(function (a, b) {
    //            return a + b.UnitPrice;
    //        })
    //        for (let i = 0; i < this.selectedItems.length; i++) {
    //             obj = {
    //                TargetSpend: this.selectedItems[i].TargetSpend,
    //                UnitPrice: this.selectedItems[i].UnitPrice,
    //            }
    //            itemarray.push(obj);
    //        }
    //        this.paService.ApproveItems(itemarray).subscribe(data => {
    //            this.paitemdetails = data;
    //        })
    //    }

    //}

    //displayapproveitems() {
    //    debugger;
    //    console.log(this.selectedItems);
    //    let item = new Object();
    //    if (this.selectedItems.length > 0) {
    //        this.hivalue = false;
    //        this.approvevalue = true;
    //        item["UnitPrice"] = this.selectedItems.map(res => res.UnitPrice).reduce((sum, current) => sum + current);
    //        item["TargetSpend"] = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current);
    //        item["DeptID"] = this.selectedItems[0].DepartmentId;
    //        console.log(this.selectedItems);
    //        this.paService.ApproveItems(item).subscribe(data => {
    //            debugger;
    //            this.employee = data;
    //        })
    //    }
    //}
    //displayapproveitems() {
    //    debugger;
    //    this.paService.itemvalues.push(this.selectedItems);
    //}
      displayapproveitems() {
          let dataa: any = this.selectedItems;
          localStorage.setItem("PADetails", JSON.stringify(this.selectedItems));
          this.routing.navigateByUrl("/SCM/mprpa");
          // this.paService.getdata(this.selectedItems);
      }
    previousitems() {
        let dataa: any = this.selectedItems;
        this.paService.getdata(this.paitemdetails, dataa);
    }

    public onSelectedOptionsChange(item: any, index: number) {
        this.showList = false;
        if (item.listName == "venderid") {
            this.vendorDetails.Vendorid = item.code;
            this.vendorDetails.VendorName = item.name;
            this.padetails.venderid = item.code;
        }
        else if (item.listName == "DepartmentId") {
            //this.department.DepartmentId = item.code;
            //this.department.Department = item.name;
            this.padetails.DepartmentId = item.code;
            this.padetails.DepartmentName = item.name;
        }
        else if (item.listName == "vendorProjectManager") {
            this.projectmanger.EmployeeNo = item.code;
            this.projectmanger.Name = item.name;
            this.padetails.vendorProjectManager = item.code;
        }
        else {
            this.buyergroups.BuyerGroupId = item.code;
            this.buyergroups.BuyerGroup = item.name;
            this.padetails.BuyerGroupId = item.code;
        }
    }
    onclickbox(selectitems: any[]) {
        this.paitemdetails = selectitems;
    }
    onChange1(itemdetails: ItemsViewModel, isChecked: boolean, event) {
        this.disableSubmit = false;
        if (this.selectedItems.length === 0)
            this.Vendorid = itemdetails.VendorId;
        if (isChecked) {
            if (this.selectedItems.length === 0) {
                this.selectedItems.push(itemdetails);
            }
            else if (this.Vendorid === itemdetails.VendorId) {
                this.selectedItems.push(itemdetails);
            }
            else {
                event.target.checked = false;
                //alert("select single vendor");
                this.messageservice.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please Select Single Vendor' });
            }
        }
        else {
            let index = this.selectedItems.indexOf(itemdetails);
            this.selectedItems.splice(index, 1);
            if (this.selectedItems.length==0) {
                this.disableSubmit = true;
            }
        }
    }

    //this.selectedItems.push(itemdetails);
    ////itemdetails.VendorId = this.Vendorid;
    ////this.VendorName = this.selectedItems[0].VendorName;
    //let element = itemdetails;
    //// this.selectedItems = [];
    //if (isChecked) {
    //    if (this.selectedItems.length === 0) {
    //        this.selectedItems.push(itemdetails);
    //        //this.selectedItems1.push(itemdetails)
    //        console.log("first", this.selectedItems)
    //    }
    //    else if (this.Vendorid === itemdetails.VendorId) {
    //        this.selectedItems.push(itemdetails);
    //    }
    //    else {
    //        alert("please select Single Vendor")
    //    }
    //    this.selectedItems.forEach((element, index) => {
    //        console.log(`Current index: ${index}`);

    //        if (element.VendorName === itemdetails.VendorName) {
    //            this.selectedItems1.push(itemdetails);
    //        }
    //        else {
    //            alert(itemdetails.VendorName);
    //        }

    //    });
    //}
    //else if (!isChecked) {
    //    alert(!isChecked)
    //}




    //    //if (isChecked) {
    //    //    for (var i = 0; i < itemdetails.length; i++) {
    //    //        if (this.VendorName == itemdetails[i].VendorName) {
    //    //            this.selectedItems.push(itemdetails[i])
    //    //        }
    //    //    }
    //    //    this.selectedItems.push(itemdetails);
    //    //} else {
    //    //    let index = this.selectedItems.indexOf(itemdetails);
    //    //    this.selectedItems.splice(index, 1);
    //    //}
    //}




    onChange(itemdetails: ItemsViewModel, isChecked: boolean) {
        if (isChecked) {
            this.selectedItems.push(itemdetails);
        } else {
            let index = this.selectedItems.indexOf(itemdetails);
            this.selectedItems.splice(index, 1);
        }
    }

    //Making Model Empty

    onsrchTxtChange(modelparm: string, value: string, model: string) {
        if (value == "") {
            this[model][modelparm] = "";
        }
    }
    //onChange1(itemdetails: ItemsViewModel, isChecked: boolean) {
    //    debugger;
    //    this.VendorName = this.selectedItems[0].VendorName;
    //    if (isChecked) {
    //        this.selectedItems.push(itemdetails);
    //    } else {
    //        let index = this.selectedItems.indexOf(itemdetails);
    //        this.selectedItems.splice(index, 1);
    //    }
    //}

}
