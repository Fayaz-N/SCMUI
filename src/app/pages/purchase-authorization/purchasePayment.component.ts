import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee, MPRVendorDetail, MPRBuyerGroup } from '../../Models/mpr';
import { PADetailsModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel } from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-purchasePayment',
    templateUrl: './purchasePayment.component.html',
})
export class purchasePaymentComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router, private route: ActivatedRoute) { }
    public purchasemodes: mprpapurchasemodesmodel[];
    public purchasetypes: mprpapurchasetypesmodel[];
    public employee: Employee;
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
    public selectedItems: any[];
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
            this.sum = this.selectedItems.map(res => res.UnitPrice).reduce((sum, current) => sum + current);
            this.target = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current);
            localStorage.removeItem("PADetails");
            this.displayapproveEmployee();
            this.showemployee = true
        }
        
        this.paService.itemdat$.subscribe(data => {
            debugger;
            this.selectedItems = data;
        })
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
        purchasedetails.RequestedBy = this.employee[0].EmployeeNo;
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
        this.paService.LoadMprPADeatilsbyid(paid).subscribe(data => {
            this.purchasedetails = data;
            this.pasubmitted = true;
        })
    }
    displayitems(padetails: PADetailsModel) {
        this.paService.LoadItems(this.padetails).subscribe(data => {
            this.paitemdetails = data;
        })
    }

    displayapproveEmployee() {
        debugger;
        console.log(this.selectedItems);
        let item = new Object();
        if (this.selectedItems.length > 0) {
            item["UnitPrice"] = this.selectedItems.map(res => res.UnitPrice).reduce((sum, current) => sum + current);
            item["TargetSpend"] = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current);
            item["DeptID"] = this.selectedItems[0].DepartmentId;
            console.log(this.selectedItems);
            this.paService.ApproveItems(item).subscribe(data => {
                this.employee = data;
                //document.getElementsByClassName("displayemployee")[0].scrollIntoView(true)
            })
        }
    }

    showItemDialogToAdd() {
        this.displayItemDialog = true;
    }

    public ispagerefresh() {
        window.history.back();
    }

}
