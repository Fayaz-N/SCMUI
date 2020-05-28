import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee, MPRVendorDetail, MPRBuyerGroup } from '../../Models/mpr';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { PADetailsModel, ItemsViewModel, EmployeeModel, MPRPAApproversModel, PurchaseCreditApproversModel, StatusCheckModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, ConfigurationModel, VendorMasterModel, padocuments } from 'src/app/Models/PurchaseAuthorization'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
@Component({
    selector: 'app-purchasePayment',
    templateUrl: './purchasePayment.component.html',
})
export class purchasePaymentComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router, public messageService: MessageService, public constants: constants, private spinner: NgxSpinnerService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }
    public itemsform: FormGroup;
    myFiles: string[] = [];
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
    public vendorDetails: MPRVendorDetail;
    public paitemdetails: Array<ItemsViewModel> = [];
    public paitem: ItemsViewModel;
    public padetails: PADetailsModel;
    public pasubmitted: boolean;
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
        this.EditDialog = false;

        this.route.params.subscribe(params => {
            if (params["PAId"]) {
                this.paid = params["PAId"];
                this.getmprpabyid(this.paid);
            }
        })
        if (localStorage.getItem("PADetails")) {
            this.selectedItems = JSON.parse(localStorage.getItem("PADetails"));
            this.sum = this.selectedItems.map(res => res.itemsum).reduce((sum, current) => sum + current);
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
            this.purchasedetails.ProjectCode = this.selectedItems[0]["JobCode"];
            this.purchasedetails.ProjectName = this.selectedItems[0]["JobName"];
            this.Buyergroup = this.selectedItems[0].BuyerGroup;
            this.purchasedetails.BuyerGroupId = this.selectedItems[0].BuyerGroupId;
            this.purchasedetails.DepartmentID = this.selectedItems[0].DepartmentId;
            this.Department = this.selectedItems[0].Department;
            this.vendorname = this.selectedItems[0].VendorName;
            this.displayRfqTerms(this.rfqrevisionid);
            localStorage.removeItem("PADetails");
            this.showemployee = true
        }
        this.PAsubmitForm = this.formBuilder.group({
            PONO: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
            POItemNo: ['', [Validators.required, Validators.maxLength(6)]],
            PODate: ['', [Validators.required]],
            Remarks: ['', [Validators.required]]
        })

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
        this.purchasedetails.VendorId = this.selectedItems[0]["VendorId"];
        this.purchasedetails.LoginEmployee = this.employee.EmployeeNo;
        for (var i = 0; i < this.selectedItems.length; i++) {
            this.RFQItemID.push(this.selectedItems[i].RFQItemsId)
            this.paitemdetails.push(this.selectedItems[i]);
            this.purchasedetails.Item.push(this.selectedItems[i]);
            //this.purchasedetails.Item = this.RFQItemID;
            //this.purchasedetails.Item = this.paitemdetails;
        }

        this.purchasedetails.ApproversList = this.employeelist.Approvers;
        this.purchasedetails.BuyerGroupManager = this.employeelist.BuyerGroupManager;
        this.purchasedetails.BGRole = this.employeelist.BGRole;
        this.purchasedetails.ProjectManager = this.employeelist.ProjectManager;
        this.purchasedetails.PMRole = this.employeelist.PMRole;
        this.purchasedetails.BuyerGroupNo = this.employeelist.BuyerGroupNo;
        this.purchasedetails.ProjectMangerNo = this.employeelist.ProjectMangerNo;
        for (var i = 0; i < this.rfqterms.length; i++) {
            this.purchasedetails.TermId.push(this.rfqterms[i]["RfqTermsid"])
        }
        this.purchasedetails.RequestedBy = this.employee.EmployeeNo;
        //this.purchasedetails.Item.RFQItemsId = this.selectedItems[0].RFQItemsId;
        this.paService.InsertPurchaseAuthorization(purchasedetails).subscribe(data => {
            this.paid = data.Sid;
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Inserted Successfully' });
            this.uploaddocuments = true;
            this.proceedvalue = false;
            //this.getmprpabyid(this.paid);
        })
    }
    finalpa(purchasedetails: mprpadetailsmodel) {
        this.purchasedetails.LoginEmployee = this.employee.EmployeeNo;
        this.purchasedetails.ApproversList = this.employeelist.Approvers;
        this.purchasedetails.PAId = this.paid;
        this.paService.finalpa(purchasedetails).subscribe(data => {
            console.log(data);
            this.getmprpabyid(this.paid);
        })
    }

    LoadAllBuyerGroups() {
        this.paService.LoadAllmprBuyerGroups().subscribe(data => {
            this.buyergroups = data;
            //this.purchasedetails.BuyerGroupId = 0;
        })
    }

    LoadAllDeaprtments() {

        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            //this.purchasedetails.DepartmentID = 0;
        });
    }
    getmprpabyid(paid: any) {
        //this.paitemdetails = new Array<ItemsViewModel>[];
        this.MPRItemDetailsid = [];
        this.paService.LoadMprPADeatilsbyid(paid).subscribe(data => {
            this.purchasedetails = data;
            this.purchasedetails.Item = data.Item;
            this.purchasedetails.ApproversList = data.ApproversList;
            this.purchasedetails.documents = data.documents;
            console.log("documents", this.purchasedetails.documents)
            console.log("iufuigdsfyg", this.purchasedetails.documents );
            this.pasubmitted = true;
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
                //item.MPRItemDetailsid.push(this.selectedItems[i].MPRItemDetailsid);
            }
            this.LoadVendorbymprdeptids(this.MPRItemDetailsid);

            //var employeeapprove;

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
            this.paService.ApproveItems(item).subscribe(data => {
                this.employeelist = data['Table'];
                this.employeelist.Approvers = data['Table'];
                //document.getElementsByClassName("displayemployee")[0].scrollIntoView(true)
            })
        }
    }
    getFileDetails(e) {
        //console.log (e.target.files);
        for (var i = 0; i < e.target.files.length; i++) {
            this.myFiles.push(e.target.files[i]);
        }
        console.log("gdgsyd", this.myFiles);
    }
    fileChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            var paid = "" + this.paid;
            formData.append(paid, file, file.name);
            this.spinner.show();
            this.paService.uploadpadocument(formData).subscribe(data => {
                this.spinner.hide();
                //(<HTMLInputElement>document.getElementById("uploadInputFile")).value = "";
               // this.paDocuments = new padocuments();
               // console.log("file", data);
               // this.paDocuments = data;
               //this.paDocuments.filename = file.name;
                //this.mprRevisionModel.MPRDocuments.push(this.mprDocuments);
            });
        }
    }


    uploadFiles() {
        const frmData: FormData = new FormData();
        var paid = "" + this.paid;
        for (var i = 0; i < this.myFiles.length; i++) {
            frmData.append(paid, this.myFiles[i]);
        }
        this.paService.uploadpadocument(frmData).subscribe(data => {
            this.paDocuments = data
        })
    }
    LoadVendorbymprdeptids(MPRItemDetailsid: any) {
        var distinct = [];
        this.paService.LoadVendorbymprdeptids(MPRItemDetailsid).subscribe(data => {
            this.vendor = data;
            //Array.from(new Set(this.vendor.map((items: any) => items.VendorName)))
            //this.vendor.map(x => x.Vendorid).filter((value, index, self) => self.indexOf(value) === index)
        })
    }

    //showItemDialogToAdd() { 
    //    this.displayItemDialog = true;
    //}

    public ispagerefresh() {
        window.history.back();
    }
    displayRfqTerms(rfqrevisionid: any) {
        this.paService.getrfqtermsbyrevisionid(rfqrevisionid).subscribe(data => {
            this.rfqterms = data;

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
        //var n1 = document.getElementById("txtcopy1");
        //var n2 = document.getElementById("txtcopy1");
        //n2.append = n1.append;

    }
//     copyvalue() {
//    var txt1 = document.getElementById("<%= txt1.ClientID %>").value;
//    document.getElementById("<%= txt2.ClientID %>").value = txt1;
//}
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
        //approvers = this.purchasedetails.ApproversList.;


        //else {
        //    this.disableapprove = true;
        //}



    }

    viewPADocument(path: string, documentname: string) {
        var path1 = path.replace(/\\/g, "/");
        console.log("mail", path1)
        path1 = this.constants.PADocumentPath + path1;
        window.open(path1);
        //window.open("http://10.29.15.68:90/PADocuments/2.xlsx");
        //this.showFileViewer = true;    
    }

    removeSelectedFile(index) {
        // Delete the item from fileNames list
        this.myFiles.splice(index, 1);
        // delete file from FileList
       // this.myFiles.splice(index, 1);
    }

    removePADoument(documentid) {
        var index = this.paDocuments.documentid;
        console.log(index)
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
    AddPaitem(paitemid: any) {
        this.EditDialog = true;
        this.paitem = paitemid;
        //this.SubmitItem(paitemid);
    }
    Cancel() {
        this.EditDialog = false;
    }    
    SubmitItem(paitem: ItemsViewModel) {
        var id = this.mprrevisionid;
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
        //    this.paitemvalue = true;
        //    var id = this.mprrevisionid;
        //    this.paService.InsertPAitems(paitem).subscribe(data => {
        //        this.paid = data;
        //        this.EditDialog = false;
        //        paitem = new ItemsViewModel();
        //        this.messageService.add({ severity: 'success', summary: 'success Message', detail: 'Item Inserted Succesfully' });
        //    })
        //}
        //this.paitem.EmployeeNo = this.employee.EmployeeNo;
        //this.purchasedetails.Item = paitem[0];

    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
}
