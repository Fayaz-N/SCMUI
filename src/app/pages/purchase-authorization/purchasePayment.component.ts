import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee, MPRVendorDetail, MPRBuyerGroup } from '../../Models/mpr';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { PADetailsModel, ItemsViewModel, EmployeeModel, MPRPAApproversModel, PurchaseCreditApproversModel, Additionaltaxes, StatusCheckModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, ConfigurationModel, VendorMasterModel, padocuments } from 'src/app/Models/PurchaseAuthorization'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { __param } from 'tslib';
//import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-purchasePayment',
    templateUrl: './purchasePayment.component.html',
})

//Name of Class: << purchasePaymentComponent >> Author :<< Akhil Kumar reddy >>
//    Date of Creation << 1 - 11 - 2019 >>
//        Purpose : << to generate PA, get PA data >>
//            Review Date:<<>> Reviewed By:<<>>
export class purchasePaymentComponent implements OnInit {

 
    public itemsform: FormGroup;
    myFiles: string[] = [];
    myfiles1: string[] = [];
    public purchasemodes: mprpapurchasemodesmodel[];
    public purchasetypes: mprpapurchasetypesmodel[];
    public employee: Employee;
    public paDocuments: padocuments;
    public disableApprovers: boolean = false;
    public uploaddocuments: boolean = false;
    public paitemvalue: boolean = false;
    public PAApprovers: MPRPAApproversModel;
    public vendor: Array<VendorMasterModel> = [];
    public Approvers = PurchaseCreditApproversModel;
    public configuration: ConfigurationModel;
    public rfqterms: Array<any> = [];
    public employeelist: EmployeeModel;
    public incompletedapprovers: any;
    public vendorDetails: MPRVendorDetail;
    public paitemdetails: Array<ItemsViewModel> = [];
    public paitem: ItemsViewModel;
    public padetails: PADetailsModel;
    public pasubmitted: boolean;
    public panotsubmitted: boolean;
    public Requestrforapprove: boolean = true;
    public EditDialog: boolean;
    public showemployee: boolean;
    public paid: number;
    public rolename: string;
    public vendorname: string;
    public selectedvendor: string;
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
    public Buyergroup: string;
    public Department: string;
    public BuyerGroupId: number;
    public Qty: number;
    public documentid: number;
    public savingorexcessamount: number;
    public status: StatusCheckModel;
    public PAsubmitForm: FormGroup;
    public mprrevisionid: number;
    public rfqno: Array<any> = [];
    public finalpasubmit: boolean = true;
    public proceedvalue: boolean = true;
    public paymentterm: string;
    public finalpaymentterm: string;
    public paincompleted: boolean = false;
    public updatevalue: boolean = true;
    public mprno: string;
    public cols: any[];
    public itemdeatils: any
    control = new FormArray([]);
    constructor(private paService: purchaseauthorizationservice, private router: Router, public messageService: MessageService, public constants: constants, private spinner: NgxSpinnerService, private route: ActivatedRoute, private formBuilder: FormBuilder) {}
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }
        //this.purchasedetails.PackagingForwarding = "Included in Price";
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
        this.paDocuments = new padocuments();
        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.MPRItemDetailsid = new Array<any>();
        this.selectedItems = new Array<any>();
        this.RFQItemID = new Array<any>();
        this.rfqrevisionid = new Array<any>();
        this.rfqterms = new Array<any>();
        this.paitem = new ItemsViewModel();
        this.configuration = new ConfigurationModel();
        this.loadallpurchasemodes();
        this.loadallpurchasetypes();
        this.LoadAllBuyerGroups();
        this.LoadAllDeaprtments();
        this.cols = new Array<any>();
        this.EditDialog = false;
        this.incompletedapprovers = new Array<any>();
        this.employeelist = new EmployeeModel();

        this.route.params.subscribe(params => {
            if (params["PAId"]) {
                this.paid = params["PAId"];
                this.getmprpabyid(this.paid);
            }
        })

        if (localStorage.getItem("PADetails")) {
            this.selectedItems = JSON.parse(localStorage.getItem("PADetails"));
            this.sum = this.selectedItems.map(res => res.itemsum).reduce((sum, current) => sum + current) ;
            this.target = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current) ||0;
            this.displayapproveEmployee();
            for (var i = 0; i < this.selectedItems.length; i++) {
                this.rfqrevisionid.push(this.selectedItems[i]["rfqRevisionId"]);
            }
            if (this.target > this.sum) {
                this.savingorexcessamount = this.target - this.sum;
            }
            else {
                this.savingorexcessamount = this.target - this.sum;
            }
            this.paymentterm = this.selectedItems[0]["PaymentTermCode"];
            this.purchasedetails.ProjectCode = this.selectedItems[0]["JobCode"];
            this.purchasedetails.ProjectName = this.selectedItems[0]["JobName"];
            this.Buyergroup = this.selectedItems[0].BuyerGroup;
            this.purchasedetails.BuyerGroupId = this.selectedItems[0].BuyerGroupId;
            this.purchasedetails.DepartmentID = this.selectedItems[0].DepartmentId;
            this.Department = this.selectedItems[0].Department;
            this.vendorname = this.selectedItems[0].VendorName;
            this.purchasedetails.mprno = this.selectedItems[0].DocumentNo;
            this.mprrevisionid = this.selectedItems[0].MPRRevisionId;
            this.displayRfqTerms(this.rfqrevisionid);
            localStorage.removeItem("PADetails");
            this.showemployee = true;
        }
    
        this.PAsubmitForm = this.formBuilder.group({
            PONO: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
            POItemNo: ['', [Validators.required, Validators.maxLength(6)]],
            PODate: ['', [Validators.required]],
            Remarks: ['', [Validators.required]]
        })

        this.purchasedetails.PackagingForwarding = "Included in Price";
        this.purchasedetails.Taxes = "GST Extra as applicable";
        this.purchasedetails.Freight = "Included in Price";
        this.purchasedetails.Insurance = "Included in Price";
        this.purchasedetails.DeliveryCondition = "3 – 4 Weeks";
        //this.purchasedetails.CreditDays = 45;
        this.purchasedetails.ShipmentMode = "By Road";
        this.purchasedetails.PaymentTerms = "Full payment after 45 days of receipt of material";
        this.purchasedetails.Warranty = "Not Applicable";
        this.purchasedetails.BankGuarantee = "Not Applicable";
        this.purchasedetails.LDPenaltyTerms = "Not Applicable";
        this.purchasedetails.SpecialInstructions = "Not Applicable"
        this.purchasedetails.FactorsForImports = "Not Applicable";
        this.purchasedetails.SpecialRemarks = "Not Applicable";

      
    }
    //Name of Function: << loadallpurchasemodes >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : << To load all purchase modes >>
    //            Review Date:<<>> Reviewed By:<<>>
    loadallpurchasemodes() {
        this.paService.LoadAllmprpapurchasemodes().subscribe(data => {
            this.purchasemodes = data;
        })
    }
        //Name of Function: << loadallpurchasemodes >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : << To load all purchase types >>
    //            Review Date:<<>> Reviewed By:<<>>
    loadallpurchasetypes() {
        this.paService.LoadAllmprpapurchasetypes().subscribe(data => {
            this.purchasetypes = data;
        })
    }

            //Name of Function: << InsertPurchaseAuthorization >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : << generating the purchase authorization for approved items>>
    //            Review Date:<<>> Reviewed By:<<>>
    InsertPurchaseAuthorization(purchasedetails: mprpadetailsmodel) {
        if (purchasedetails.PurchaseTypeId != undefined && purchasedetails.PurchaseModeId != undefined) {
            this.purchasedetails.Item = [];
            this.purchasedetails.ApproversList = [];
            this.purchasedetails.TermId = [];
            this.purchasedetails.VendorId = this.selectedItems[0]["VendorId"];
            this.purchasedetails.LoginEmployee = this.employee.EmployeeNo;
            for (var i = 0; i < this.selectedItems.length; i++) {
                this.RFQItemID.push(this.selectedItems[i].RFQItemsId)
                this.paitemdetails.push(this.selectedItems[i]);
                this.purchasedetails.Item.push(this.selectedItems[i]);
            }

            this.purchasedetails.ApproversList = this.employeelist.Approvers;
            for (var i = 0; i < this.rfqterms.length; i++) {
                this.purchasedetails.TermId.push(this.rfqterms[i]["RfqTermsid"])
            }
            this.purchasedetails.RequestedBy = this.employee.EmployeeNo;
            //this.purchasedetails.Item.RFQItemsId = this.selectedItems[0].RFQItemsId;
            this.paService.InsertPurchaseAuthorization(purchasedetails).subscribe(data => {
                this.paid = data.Sid;
                this.uploaddocuments = true;
                this.proceedvalue = false;
            })
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select PurchaseType and Purchase Mode' });
        }

    }
/*Name of Function : <<finalpa>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<Inserting approvers to the generated pa based on pa value,target spend and credit days>>
Review Date :<<>>   Reviewed By :<<>>*/
    finalpa(purchasedetails: mprpadetailsmodel) {
        this.purchasedetails.LoginEmployee = this.employee.EmployeeNo;
        this.purchasedetails.ApproversList = this.employeelist.Approvers;
        this.purchasedetails.PAId = this.paid;
        this.paService.finalpa(purchasedetails).subscribe(data => {
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Inserted Successfully' });
            this.getmprpabyid(this.paid);
        })
    }

/*Name of Function : <<LoadAllmprBuyerGroups>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<To load all buyergroups from mpr buyer groups>>
Review Date :<<>>   Reviewed By :<<>>*/
    LoadAllBuyerGroups() {
        this.paService.LoadAllmprBuyerGroups().subscribe(data => {
            this.buyergroups = data;
            //this.purchasedetails.BuyerGroupId = 0;
        })
    }
/*Name of Function : <<LoadAllDepartments>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<To load all departments from mpr Departments>>
Review Date :<<>>   Reviewed By :<<>>*/
    LoadAllDeaprtments() {

        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            //this.purchasedetails.DepartmentID = 0;
        });
    }
/*Name of Function : <<getmprpabyid>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<getting pa details by paid>>
Review Date :<<>>   Reviewed By :<<>>*/
    getmprpabyid(paid: any) {
        //this.paitemdetails = new Array<ItemsViewModel>[];
        this.uploaddocuments = false;
        this.MPRItemDetailsid = [];
        this.paService.LoadMprPADeatilsbyid(paid).subscribe(data => {
            this.purchasedetails = data;
            this.purchasedetails.Item = data.Item;
            console.log(" this.purchasedetails.Item", this.purchasedetails.Item)
            this.purchasedetails.ApproversList = data.ApproversList;
            this.purchasedetails.documents = data.documents;
            this.finalpaymentterm = this.purchasedetails.Item[0]["PaymentTermCode"];
            if (this.purchasedetails.PAStatus == "Pending" || this.purchasedetails.PAStatus == "Approved" || this.purchasedetails.PAStatus == "Submitted" || this.purchasedetails.PAStatus == "Rejected") {
                this.pasubmitted = true;
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.purchasedetails.Item[i]["itemsum"] = (this.purchasedetails.Item[i]["QuotationQty"] * this.purchasedetails.Item[i]["UnitPrice"]) + this.purchasedetails.Item[i]["TotalFreightAmount"] + this.purchasedetails.Item[i]["TotalPFAmount"] + this.purchasedetails.Item[i]["HandlingAmount"] + this.purchasedetails.Item[i]["DutyAmount"] + this.purchasedetails.Item[i]["ImportFreightAmount"] + this.purchasedetails.Item[i]["InsuranceAmount"]
                }
                this.mprrevisionid = this.purchasedetails.Item[0]["MPRRevisionId"];
                this.sum =  this.purchasedetails.Item.map(res => res["itemsum"]).reduce((sum, current) => sum + current);
                this.target = this.purchasedetails.Item.map(res => res["TargetSpend"]).reduce((sum, current) => sum + current);
                if (this.target > this.sum) {
                    this.savingorexcessamount = this.target - this.sum;
                }
                else {
                    this.savingorexcessamount = this.target - this.sum;
                }
                this.selectedvendor = this.purchasedetails.Item[0]["VendorName"];
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.MPRItemDetailsid.push(this.purchasedetails.Item[i]["MRPItemsDetailsID"]);
                }
                this.LoadVendorbymprdeptids(this.MPRItemDetailsid);
                for (var i = 0; i < this.purchasedetails.ApproversList.length; i++) {
                    var employeeapprove = this.purchasedetails.ApproversList[i]["EmployeeNo"] === this.employee.EmployeeNo;
                    if (this.purchasedetails.ApproversList[i]["EmployeeNo"] === this.employee.EmployeeNo) {
                        this.approvedemployee = true
                        this.rolename = this.purchasedetails.ApproversList[i]["RoleName"];
                        if (this.purchasedetails.ApproversList[i]["ApprovalStatus"] == "Approved" || this.purchasedetails.ApproversList[i]["ApprovalStatus"] == "Rejected") {
                            this.disableApprovers = true;
                        }
                    }
                }
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.rfqrevisionid.push(this.purchasedetails.Item[i]["RFQRevisionId"]);
                }
                this.displayRfqTerms(this.rfqrevisionid)
                this.showemployee = true;
            } 
            else {
                this.paincompleted = true;
                this.displayapproveEmployee1();
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.purchasedetails.Item[i]["itemsum"] = this.purchasedetails.Item[i]["QuotationQty"] * this.purchasedetails.Item[i]["UnitPrice"]
                }
                this.mprrevisionid = this.purchasedetails.Item[0]["MPRRevisionId"];
                this.sum = this.purchasedetails.Item.map(res => res["itemsum"]).reduce((sum, current) => sum + current);
                this.target = this.purchasedetails.Item.map(res => res["TargetSpend"]).reduce((sum, current) => sum + current);
                if (this.target > this.sum) {
                    this.savingorexcessamount = this.target - this.sum;
                }
                else {
                    this.savingorexcessamount = this.target - this.sum;
                }
                this.selectedvendor = this.purchasedetails.Item[0]["VendorName"];
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.MPRItemDetailsid.push(this.purchasedetails.Item[i]["MRPItemsDetailsID"]);
                }
                this.LoadVendorbymprdeptids(this.MPRItemDetailsid);

                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.rfqrevisionid.push(this.purchasedetails.Item[i]["RFQRevisionId"]);
                }
                this.displayRfqTerms(this.rfqrevisionid)
                this.showemployee = true;
            }


        })
    }
    displayitems(padetails: PADetailsModel) {
        this.paService.LoadItems(padetails).subscribe(data => {
            this.purchasedetails.Item['POStatusDate'] = new Date();
            this.paitemdetails = data;
        })
    }
/*Name of Function : <<displayapproveEmployee>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<getting configured employee based on total pa value,target spend and credit days>>
Review Date :<<>>   Reviewed By :<<>>*/
    displayapproveEmployee() {
        //console.log("items1", this.selectedItems)
        this.MPRItemDetailsid = [];
        let item = new ConfigurationModel();
        if (this.selectedItems.length > 0) {
            item.MPRItemDetailsid = [];
            item["UnitPrice"] = this.selectedItems.map(res => res.itemsum).reduce((sum, current) => sum + current);
            //item["UnitPrice"] = item["UnitPrice"] ;
            item["TargetSpend"] = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current);
            item["DeptID"] = this.selectedItems[0].DepartmentId;
            item["PaymentTermCode"] = this.selectedItems[0].PaymentTermCode;
            item.BuyerGroupId = this.selectedItems[0].BuyerGroupId;
            console.log("item.BuyerGroupId", item)
            for (var i = 0; i < this.selectedItems.length; i++) {
                this.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid)
                item.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid);
            }
            this.LoadVendorbymprdeptids(this.MPRItemDetailsid);
            this.paService.ApproveItems(item).subscribe(data => {
                this.employeelist = data['Table'];
                this.employeelist.Approvers = data['Table'];
                //this.incompletedapprovers = this.employeelist;
            })
        }
    }
/*Name of Function : <<displayapproveEmployee>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<getting configured employee based on total pa value,target spend and credit days>>
Review Date :<<>>   Reviewed By :<<>>*/
    displayapproveEmployee1() {
        this.MPRItemDetailsid = [];
        let item = new ConfigurationModel();
        if (this.purchasedetails.Item.length > 0) {
            item.MPRItemDetailsid = [];
            for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                this.purchasedetails.Item[i]["itemsum"] = this.purchasedetails.Item[i]["QuotationQty"] * this.purchasedetails.Item[i]["UnitPrice"];
            }

            item["UnitPrice"] = this.purchasedetails.Item.map(res => res["itemsum"]).reduce((sum, current) => sum + current);
            item["TargetSpend"] = this.purchasedetails.Item.map(res => res["TargetSpend"]).reduce((sum, current) => sum + current);
            item["DeptID"] = this.purchasedetails.DepartmentID;
            item["PaymentTermCode"] = this.purchasedetails.Item[0]["PaymentTermCode"];
            for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                this.MPRItemDetailsid.push(this.purchasedetails.Item[i]["MRPItemsDetailsID"])
                //item.MPRItemDetailsid.push(this.purchasedetails.Item[i]["MRPItemsDetailsID"]);
            }
            this.LoadVendorbymprdeptids(this.MPRItemDetailsid);
            this.paService.ApproveItems(item).subscribe(data => {
                this.employeelist = data['Table'];
                this.employeelist.Approvers = data['Table'];  
                //this.employeelist.Approvers = data;
                console.log("employeelist", this.employeelist)
            })
        }
    }



    fileChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            var paid = "" + this.paid;
            formData.append(paid, file, file.name);
            this.spinner.show();
           // this.paService.uploadpadocument(formData).subscribe(data => {
                this.spinner.hide();
                //
               // this.paDocuments = new padocuments();
                // console.log("file", data);
                //(<HTMLInputElement>document.getElementById("uploadInputFile")).value = "";
               // this.paDocuments = data;
               //this.paDocuments.filename = file.name;
                //this.mprRevisionModel.MPRDocuments.push(this.mprDocuments);
            //});
        }
    }


    getFileDetails(e) {
        //this.myFiles = e.target.files;
        for (var i=0; i < e.target.files.length; i++) {
            this.myFiles.push(e.target.files[i]);
        }
        (<HTMLInputElement>document.getElementById("file")).value = "";
    }

    getFileuploadDetails(e) {
        //console.log (e.target.files);
        for (var i = 0; i < e.target.files.length; i++) {
            this.myfiles1.push(e.target.files[i]);
        }
        (<HTMLInputElement>document.getElementById("file1")).value = "";
    }

    uploadFiles() {

        const frmData: FormData = new FormData();
        var paid = "" + this.paid;
        var employeeno = this.employee.EmployeeNo;
            (<HTMLInputElement>document.getElementById("file")).value = "";
        for (var i = 0; i < this.myFiles.length; i++) {
            frmData.append(paid, this.myFiles[i]);
        }

        //this.myFiles.pop();
        //var paid = "" + this.paid;
        //const formData: any = new FormData();
        //let files: any[] = this.myFiles;
        //for (let i = 0; i < files.length; i++) {
        //    formData.append(paid, files[i]);
        //}
        this.myFiles.pop();
        this.paService.uploadpadocument(frmData).subscribe(data => {
            this.paDocuments = data
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'file uploaded Successfully' });
        })
       
    }

    uploadapprovedFiles() {
        const formData: FormData = new FormData();
        var paid = "" + this.paid;
        var employeeno = this.employee.EmployeeNo
        for (var i = 0; i < this.myfiles1.length; i++) {
            formData.append(paid, this.myfiles1[i]);
        }
        this.myfiles1.pop();
        this.paService.uploadpadocument(formData).subscribe(data => {
            this.paDocuments = data
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'file uploaded Successfully' });
            this.getmprpabyid(this.paid);
        })

    }
    removeSelectedFile(index) {
        this.myFiles.splice(index, 1);
    }
    removeSelecteduploadFile(index) {
        this.myfiles1.splice(index, 1);
    }

    LoadVendorbymprdeptids(MPRItemDetailsid: any) {
        var distinct = [];
        this.paService.LoadVendorbymprdeptids(MPRItemDetailsid).subscribe(data => {
            this.vendor = data;
        })
    }

    //showItemDialogToAdd() { 
    //    this.displayItemDialog = true;
    //}

    public ispagerefresh() {
        window.history.back();
    }
/*Name of Function : <<displayRfqTerms>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<getting the assigned vendor rfq terms by revisionid>>
Review Date :<<>>   Reviewed By :<<>>*/
    displayRfqTerms(rfqrevisionid: any) {
        this.paService.getrfqtermsbyrevisionid(rfqrevisionid).subscribe(data => {
            this.rfqterms = data;
            if (this.selectedItems.length != 0) {
                this.cols = [
                    { field: 'Terms', header: 'Terms' },
                    { field: 'RFQrevisionId', header: 'RFQrevisionId' },
                    { field: this.selectedItems[0]["RFQNo"], header: this.selectedItems[0]["RFQNo"] }
                ];
            }
            else {
                this.cols = [
                    { field: 'Terms', header: 'Terms' },
                    { field: 'RFQrevisionId', header: 'RFQrevisionId' },
                    { field: this.purchasedetails.Item[0]["RFQNo"], header: this.purchasedetails.Item[0]["RFQNo"] }
                ];
            }

            console.log("terms", this.cols)
            let lookup = {};
            for (let i = 0; i < this.rfqterms.length; i++) {
                if (!lookup[this.rfqterms[i]]) {
                    lookup[this.rfqterms[i]] = true;
                    this.rfqno.push(this.rfqterms[i]);
                }
            }


        })
    }
    updateAddrs(event, paitem: ItemsViewModel) {
        if (event.target.checked) {

            //this.paitem.PONO = paitem.PONO
            (<HTMLInputElement>document.getElementById("txtcopy1")).value = paitem.PONO;
        }
        else {
            this.paitem.PONO = '';
        }
    }
/*Name of Function : <<Approvepa>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<updating assigned approver status after approving or rejection of pa>>
Review Date :<<>>   Reviewed By :<<>>*/
    Approvepa(approvers: MPRPAApproversModel) {
       var data= this.purchasedetails.Item;
        if (approvers.ApprovalStatus != '' && approvers.ApprovalStatus != null) {
            //this.disableapprove = false;
            approvers.MPRRevisionId = this.mprrevisionid;
            approvers.PAId = this.paid;
            approvers.RoleName = this.rolename;
            approvers.EmployeeNo = this.employee.EmployeeNo;
            this.paService.Updatepaapproverstatus(approvers).subscribe(data => {
                this.status = data;
                this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Status Updated Successfully' });
                this.getmprpabyid(approvers.PAId);
            })

        } else {
            alert("Please select Approval status")
        }

    }

    viewPADocument(path: string, documentname: string) {
        var path1 = path.replace(/\\/g, "/");
        console.log("mail", path1)
        path1 = this.constants.PADocumentPath + path1;
        window.open(path1);
  
    }



    removePADoument(documentid) {
        //var index = this.paDocuments.documentid;
        //console.log(index)
        //if (details.MprDocId) {
        //    this.MprService.deleteMPRDocument(details).subscribe(data => {
        //        if (data == true) {
        //            this.mprRevisionModel.MPRDocuments.splice(index, 1);
        //            this.MPR3Documents = this.mprRevisionModel.MPRDocuments.filter(li => li.DocumentTypeid == 2);
        //        }
        //    });
        //}
        //else {
        //    this.mprRevisionModel.MPRDocuments.splice(index, 1);
        //    this.MPR3Documents = this.mprRevisionModel.MPRDocuments.filter(li => li.DocumentTypeid == 2);
        //}
    }
    RequestForApproval(Approvers: any) {
        Approvers.PAid = this.paid;
        console.log(Approvers)
        this.paService.RequestForApproval(Approvers).subscribe(data => {
            this.buyergroups = data;
            this.messageService.add({ severity: 'success', summary: 'success Message', detail: 'Reminder Sent Succesfully' });
        })
    }
    AddPaitem() {
        this.EditDialog = true;
        //var app = angular.module('myapp', []);
        this.itemdeatils = this.purchasedetails.Item;
       //var itemdeatils = this.purchasedetails.Item;
       // console.log("this.paitem", itemdeatils)
        
    }
    Cancel() {
        this.EditDialog = false;
    }
    /*Name of Function : <<SubmitItem>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<inserting pa items after pa approval>>
Review Date :<<>>   Reviewed By :<<>>*/

    SubmitItem(paitem: any) {
        var id = this.mprrevisionid;
        paitem.EmployeeNo = this.employee.EmployeeNo;
        this.paService.InsertPAitems(paitem).subscribe(data => {
            this.paid = data;
            this.EditDialog = false;
            paitem = new ItemsViewModel();
            this.messageService.add({ severity: 'success', summary: 'success Message', detail: 'Item Inserted Succesfully' });
        })
        //if (this.PAsubmitForm.invalid) {
        //    return;
        //}
        //else {
        //    var id = this.mprrevisionid;
        //    paitem.EmployeeNo = this.employee.EmployeeNo;
        //    this.paService.InsertPAitems(paitem).subscribe(data => {
        //        this.paid = data;
        //        this.EditDialog = false;
        //        paitem = new ItemsViewModel();
        //        this.messageService.add({ severity: 'success', summary: 'success Message', detail: 'Item Inserted Succesfully' });
        //    })
        //}

    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
    onSearchChange(creditdays: any) {
        this.displaycustomapproveEmployee(creditdays);
    }
    displaycustomapproveEmployee(creditdays: any) {
        this.MPRItemDetailsid = [];
        console.log("purchasedetails",this.purchasedetails)
        let item = new ConfigurationModel();
        if (this.selectedItems.length > 0) {
            item.MPRItemDetailsid = [];
            item["UnitPrice"] = this.selectedItems.map(res => res.itemsum).reduce((sum, current) => sum + current);
            item["TargetSpend"] = this.selectedItems.map(res => res.TargetSpend).reduce((sum, current) => sum + current);
            item["DeptID"] = this.selectedItems[0].DepartmentId;
            //item["PaymentTermCode"] = creditdays;
            item["Creditdays"] = creditdays;

            for (var i = 0; i < this.selectedItems.length; i++) {
                this.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid)
                item.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid);
            }
            this.LoadVendorbymprdeptids(this.MPRItemDetailsid);
            this.spinner.show();
            this.paService.ApproveItems(item).subscribe(data => {
                this.spinner.hide();
                this.employeelist = data['Table'];
                this.employeelist.Approvers = data['Table'];
            })
        }
    }
/*Name of Function : <<UpdatePurchaseAuthorization>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<Updating the inprogress purchase authorization>>
Review Date :<<>>   Reviewed By :<<>>*/
    UpdatePurchaseAuthorization(purchasedetails: mprpadetailsmodel) {
        
        if (purchasedetails.PurchaseTypeId != undefined && purchasedetails.PurchaseModeId != undefined) {
            this.updatevalue = false;
            this.purchasedetails.PAId = this.paid;
            this.purchasedetails.Item = [];
            this.purchasedetails.ApproversList = [];
            this.purchasedetails.TermId = [];
            this.purchasedetails.LoginEmployee = this.employee.EmployeeNo;
            this.purchasedetails.ApproversList = this.employeelist.Approvers;
            for (var i = 0; i < this.rfqterms.length; i++) {
                this.purchasedetails.TermId.push(this.rfqterms[i]["RfqTermsid"])
            }
            this.purchasedetails.RequestedBy = this.employee.EmployeeNo;
            this.paService.UpdatePurchaseAuthorization(purchasedetails).subscribe(data => {
                this.paid = data.Sid;
                this.uploaddocuments = true;
                this.proceedvalue = false;
                
            })
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select PurchaseType and Purchase Mode' });
        }

    }
/*Name of Function : <<Deletefile>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<Deleting the Attached pa dcoument>>
Review Date :<<>>   Reviewed By :<<>>*/
    Deletefile(documents: number) {
        this.paDocuments.DocumentId = documents
        this.paService.DeletePADocument(this.paDocuments).subscribe(data => {
            this.paDocuments.DocumentId = data.Sid;
            this.getmprpabyid(this.paid);
        })

    }
    //setdate() {
    //    const dateSendingToServer = new DatePipe('en-US').transform(this.purchasedetails.Item[0]['POStatusDate'], 'dd/MM/yyyy')
    //    console.log("dateSendingToServer",dateSendingToServer);
    //}
/*Name of Function : <<copyCharges>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<copying pono,poitemno,podate and remarks to each item wise>>
Review Date :<<>>   Reviewed By :<<>>*/
    copyCharges(event: any, type: any) {
        if (type == 'PONO') {
            if (event.target.checked == true && this.purchasedetails.Item[0]["PONO"] != null) {
                var pono = this.purchasedetails.Item[0]["PONO"]
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.purchasedetails.Item[i]["PONO"] = pono;
                }
            }
            else {
                event.target.checked = false;
                this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please Enter PONO At Starting Row' });
            }
        }
        if (type == 'POITEMNO' ) {
            if (event.target.checked == true && this.purchasedetails.Item[0]["POItemNo"] != null) {
                var POITEMNO = this.purchasedetails.Item[0]["POItemNo"]
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.purchasedetails.Item[i]["POItemNo"] = POITEMNO;
                }
            }
            else {
                event.target.checked = false;
                this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please Enter POITEMNO At Starting Row' });
            }
        }
        if (type == 'PODATE') {
            if (event.target.checked == true && this.purchasedetails.Item[0]["POStatusDate"] != null) {
                var PODATE = this.purchasedetails.Item[0]["POStatusDate"]
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.purchasedetails.Item[i]["POStatusDate"] = PODATE;
                }
            }
            else {
                event.target.checked = false;
                this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please Enter PODate At Starting Row' });
            }
        }
        if (type == 'POREMARKS') {
            if (event.target.checked == true && this.purchasedetails.Item[0]["Remarks"] != null) {
                var POREMARKS = this.purchasedetails.Item[0]["Remarks"]
                for (var i = 0; i < this.purchasedetails.Item.length; i++) {
                    this.purchasedetails.Item[i]["Remarks"] = POREMARKS;
                }
            }
            else {
                event.target.checked = false;
                this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please Enter Remarks At Starting Row' });
            }
        }

    }
    modelChangeFn(event: any) {
        console.log("event", event)
        this.purchasedetails.Item[0]["POStatusDate"] = event;
    }
}
