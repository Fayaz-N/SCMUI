import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee, MPRVendorDetail, MPRBuyerGroup } from '../../Models/mpr';
import { MessageService } from 'primeng/api';
import { MprService } from 'src/app/services/mpr.service';
import { PADetailsModel, ItemsViewModel, EmployeeModel, MPRPAApproversModel, PurchaseCreditApproversModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, ConfigurationModel, VendorMasterModel } from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-purchasePayment',
    templateUrl: './purchasePayment.component.html',
})
export class purchasePaymentComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router, public messageService: MessageService, private route: ActivatedRoute) { }
    public purchasemodes: mprpapurchasemodesmodel[];
    public purchasetypes: mprpapurchasetypesmodel[];
    public employee: Employee;
    public PAApprovers: MPRPAApproversModel;
    public vendor: Array<VendorMasterModel> = [];
    public Approvers = PurchaseCreditApproversModel;
    public configuration: ConfigurationModel;
    public rfqterms: Array<any> = [];
    public employeelist: EmployeeModel;
    public vendorDetails: MPRVendorDetail;
    public paitemdetails: Array<ItemsViewModel> = [];
    public padetails: PADetailsModel;
    public pasubmitted: boolean;
    public displayItemDialog: boolean;
    public showemployee: boolean;
    public paid: number
    public rfqrevisionid: Array<any> = [];
    public approvedemployee: boolean;
    public buyergroups: any[];
    public departmentlist: any[];
    public MPRItemDetailsid: any[];
    public purchasedetails: mprpadetailsmodel;
    public selectedItems: Array<any> = [];
    public RFQItemID: Array<any> = [];
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
        this.PAApprovers = new MPRPAApproversModel();
        this.showemployee = false;
        this.approvedemployee = false;
        this.purchasemodes = new Array<mprpapurchasemodesmodel>();
        this.purchasetypes = new Array<mprpapurchasetypesmodel>();
        this.purchasedetails = new mprpadetailsmodel();
        this.vendorDetails = new MPRVendorDetail();
        this.padetails = new PADetailsModel();
        this.paitemdetails = new Array<ItemsViewModel>();
        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.MPRItemDetailsid = new Array<any>();
        this.selectedItems = new Array<any>();
        this.RFQItemID = new Array<any>();
        this.rfqrevisionid = new Array<any>();
        this.rfqterms = new Array<any>();
        this.configuration = new ConfigurationModel();
        this.loadallpurchasemodes();
        this.loadallpurchasetypes();
        this.LoadAllBuyerGroups();
        this.LoadAllDeaprtments();

        this.route.params.subscribe(params => {
            if (params["PAId"]) {
                this.paid = params["PAId"];
                this.getmprpabyid(this.paid);
            }
        })
        if (localStorage.getItem("PADetails")) {
            this.selectedItems = JSON.parse(localStorage.getItem("PADetails"));
            this.sum = this.selectedItems.map(res => res.itemsum).reduce((sum, current) => sum + current);
            this.target = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current);
            this.displayapproveEmployee();
            for (var i = 0; i < this.selectedItems.length; i++) {
                this.rfqrevisionid.push(this.selectedItems[i]["rfqRevisionId"]);
            }
            this.purchasedetails.BuyerGroupId = this.selectedItems[0].BuyerGroupId;
            this.displayRfqTerms(this.rfqrevisionid);
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
        this.purchasedetails.ApproversList = [];
        this.purchasedetails.TermId = [];

        //console.log(this.employeelist.Approvers, "approver");
        for (var i = 0; i < this.selectedItems.length; i++) {
            this.RFQItemID.push(this.selectedItems[i].RFQItemsId)
            this.paitemdetails.push(this.selectedItems[i]);
            this.purchasedetails.Item.push(this.selectedItems[i]);
            //this.purchasedetails.Item = this.RFQItemID;
            //this.purchasedetails.Item = this.paitemdetails;
        }
        for (var i = 0; i < this.employeelist.Approvers.length; i++) {
            this.purchasedetails.ApproversList.push(this.employeelist.Approvers[i]);
        }
        for (var i = 0; i < this.rfqterms.length; i++) {
            this.purchasedetails.TermId.push(this.rfqterms[i]["RfqTermsid"])
        }
        this.purchasedetails.RequestedBy = this.employee.EmployeeNo;
        //this.purchasedetails.Item.RFQItemsId = this.selectedItems[0].RFQItemsId;
        this.paService.InsertPurchaseAuthorization(purchasedetails).subscribe(data => {
            this.paid = data;
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Inserted Successfully' });
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
        this.MPRItemDetailsid = [];
        this.paService.LoadMprPADeatilsbyid(paid).subscribe(data => {
            this.purchasedetails = data;
            this.purchasedetails.Item = data.Item;
            this.purchasedetails.ApproversList = data.ApproversList;
            this.pasubmitted = true;
            for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                this.MPRItemDetailsid.push(this.purchasedetails.Item[i]["MRPItemsDetailsID"]);
                //item.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid);
            }
            this.LoadVendorbymprdeptids(this.MPRItemDetailsid);
            for (var i = 0; i < this.purchasedetails.ApproversList.length; i++) {
                var employeeapprove = this.purchasedetails.ApproversList[i]["EmployeeNo"] === this.employee.EmployeeNo
                if (employeeapprove == false) {
                    this.approvedemployee = false
                }
                else {
                    this.approvedemployee = true;
                }
            }
           
            //this.displayapproveEmployee();
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
        this.MPRItemDetailsid = [];
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
                this.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid)
                item.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid);
            }
            this.LoadVendorbymprdeptids(this.MPRItemDetailsid);
            console.log(this.selectedItems);
            this.paService.ApproveItems(item).subscribe(data => {
                this.employeelist = data;
                //this.employeelist.Approvers = data;
                //document.getElementsByClassName("displayemployee")[0].scrollIntoView(true)
            })
        }
    }
    LoadVendorbymprdeptids(MPRItemDetailsid: any) {
        debugger;
        var distinct = [];
        this.paService.LoadVendorbymprdeptids(MPRItemDetailsid).subscribe(data => {
            this.vendor = data;
            //Array.from(new Set(this.vendor.map((items: any) => items.VendorName)))
            //this.vendor.map(x => x.Vendorid).filter((value, index, self) => self.indexOf(value) === index)
        })
    }

    showItemDialogToAdd() {
        this.displayItemDialog = true;
    }

    public ispagerefresh() {
        window.history.back();
    }
    displayRfqTerms(rfqrevisionid:any) {
        this.paService.getrfqtermsbyrevisionid(rfqrevisionid).subscribe(data => {
            this.rfqterms = data;
        })
    }
    Approvepa(approvers: MPRPAApproversModel) {
        approvers.PAId = this.paid;
        this.paService.Updatepaapproverstatus(approvers).subscribe(data => {
            this.getmprpabyid = data;
        })
    }
}
