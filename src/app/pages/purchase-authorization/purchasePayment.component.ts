import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee, MPRVendorDetail, MPRBuyerGroup } from '../../Models/mpr';
import { PADetailsModel, ItemsViewModel, EmployeeModel, PurchaseCreditApproversModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, ConfigurationModel, VendorMasterModel } from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-purchasePayment',
    templateUrl: './purchasePayment.component.html',
})
export class purchasePaymentComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router, private route: ActivatedRoute) { }
    public purchasemodes: mprpapurchasemodesmodel[];
    public purchasetypes: mprpapurchasetypesmodel[];
    public employee: Employee;
    public vendor: Array<VendorMasterModel> = [];
    public Approvers = PurchaseCreditApproversModel;
    public configuration: ConfigurationModel;
    public employeelist: EmployeeModel;
    public vendorDetails: MPRVendorDetail;
    public paitemdetails: Array<ItemsViewModel> = [];
    public padetails: PADetailsModel;
    public pasubmitted: boolean;
    public displayItemDialog: boolean;
    public showemployee: boolean;
    public paid: number;
    public buyergroups: any[];
    public departmentlist: any[];
    public purchasedetails: mprpadetailsmodel;
    public selectedItems: Array<any> = [];
    public RFQItemID: Array<any> = []
    public sum: number;
    public target: number;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }

        //this.paitemdetails = this.paService.itemvalues;
        this.showemployee = false;
        this.purchasemodes = new Array<mprpapurchasemodesmodel>();
        this.purchasetypes = new Array<mprpapurchasetypesmodel>();
        this.purchasedetails = new mprpadetailsmodel();
        this.vendorDetails = new MPRVendorDetail();
        this.padetails = new PADetailsModel();
        this.paitemdetails = new Array<ItemsViewModel>();
        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.selectedItems = new Array<any>();
        this.RFQItemID = new Array<any>();
        this.configuration = new ConfigurationModel();
        this.loadallpurchasemodes();
        this.loadallpurchasetypes();
        this.LoadAllBuyerGroups();
        this.LoadAllDeaprtments();

        this.route.params.subscribe(params => {
            if (params["PAId"]) {
                var paid = params["PAId"];
                this.getmprpabyid(paid);
            }
        })
        if (localStorage.getItem("PADetails")) {
            this.selectedItems = JSON.parse(localStorage.getItem("PADetails"));
            this.sum = this.selectedItems.map(res => res.itemsum).reduce((sum, current) => sum + current);
            this.target = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current);
            this.displayapproveEmployee();
            localStorage.removeItem("PADetails");
            this.showemployee = true
        }
        
        //this.paService.itemdat$.subscribe(data => {
        //    this.selectedItems = data;
        //})
    }
    loadallpurchasemodes() {
        this.paService.LoadAllmprpapurchasemodes().subscribe(data => {
            this.purchasemodes = data;
        })
    }
    loadallpurchasetypes() {
        this.paService.LoadAllmprpapurchasetypes().subscribe(data => {
            this.purchasetypes = data;
        })
    }
    InsertPurchaseAuthorization(purchasedetails: mprpadetailsmodel) {
        this.purchasedetails.Item = [];
        for (var i = 0; i < this.selectedItems.length; i++) {
            this.RFQItemID.push(this.selectedItems[i].RFQItemsId)
            this.paitemdetails.push(this.selectedItems[i]);
            this.purchasedetails.Item.push(this.selectedItems[i]);
            //this.purchasedetails.Item = this.RFQItemID;
            //this.purchasedetails.Item = this.paitemdetails;
        }
        this.purchasedetails.RequestedBy = this.employee.EmployeeNo;
        //this.purchasedetails.Item.RFQItemsId = this.selectedItems[0].RFQItemsId;
        this.paService.InsertPurchaseAuthorization(purchasedetails).subscribe(data => {
            this.paid = data;
        })
    }
    LoadAllBuyerGroups() {
        this.paService.LoadAllmprBuyerGroups().subscribe(data => {
            this.buyergroups = data;
            this.purchasedetails.BuyerGroupId = 0;
        })
    }
    LoadAllDeaprtments() {

        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            this.purchasedetails.DepartmentID = 0;
        });
    }
    getmprpabyid(paid: any) {
        debugger;
        //this.paitemdetails = new Array<ItemsViewModel>[];
        this.selectedItems;
        this.paService.LoadMprPADeatilsbyid(paid).subscribe(data => {
            this.purchasedetails = data;
            this.purchasedetails.Item = data.Item;
            this.pasubmitted = true;
            this.displayapproveEmployee();
            this.showemployee = true;
        })
    }
    displayitems(padetails: PADetailsModel) {
        this.paService.LoadItems(padetails).subscribe(data => {
            this.paitemdetails = data;
        })
    }

    displayapproveEmployee() {
        debugger;
        this.departmentlist = [];
        //this.employeelist.Approvers = [];
        console.log(this.selectedItems);
        let item = new ConfigurationModel();
        if (this.selectedItems.length > 0) {
            item.MPRItemDetailsid = [];
            item["UnitPrice"] = this.selectedItems.map(res => res.itemsum).reduce((sum, current) => sum + current);
            item["TargetSpend"] = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current);
            item["DeptID"] = this.selectedItems[0].DepartmentId;
            item["PaymentTermCode"] = this.selectedItems[0].PaymentTermCode;
            for (var i = 0; i < this.selectedItems.length; i++) {
                this.departmentlist.push(this.selectedItems[i].MPRItemDetailsid)
                item.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid);
            }
            this.LoadVendorbymprdeptids(this.departmentlist);
            console.log(this.selectedItems);
            this.paService.ApproveItems(item).subscribe(data => {
                this.employeelist = data;
                this.employeelist.Approvers = data.Approvers;
                //document.getElementsByClassName("displayemployee")[0].scrollIntoView(true)
            })
        }
    }
    LoadVendorbymprdeptids(departmentlist: any) {
        this.paService.LoadVendorbymprdeptids(departmentlist).subscribe(data => {
            this.vendor = data;
            this.vendor.forEach((item, index) => {
                if (index !== this.vendor.findIndex(i => i.VendorName === item.VendorName)) {
                    this.vendor.splice(index,1)
                }
            })
            
        })
    }
    showItemDialogToAdd() {
        this.displayItemDialog = true;
    }

    public ispagerefresh() {
        window.history.back();
    }

}
