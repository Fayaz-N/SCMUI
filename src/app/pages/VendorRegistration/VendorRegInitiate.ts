import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee, searchList, VendorRegApprovalProcess, VendorRegStatus, DynamicSearchResult, VendorRegistration } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-VendorRegInitiate',
  templateUrl: './VendorRegInitiate.component.html'
})
export class VendorRegInitiateComponent implements OnInit {

  constructor(public MprService: MprService, private route: ActivatedRoute, private router: Router, public constants: constants, private messageService: MessageService, private spinner: NgxSpinnerService) { }

  public employee: Employee;
  public VendorRegApprovalProcess: VendorRegApprovalProcess;
  public VendorRegStatus: VendorRegStatus;
  public VendorData: VendorRegistration;
  public dynamicData = new DynamicSearchResult();
  public formName: string;
  public txtName: string;
  public vendorEmailList: Array<any> = [];
  public selectedEmail: string;
  public searchItems: Array<searchList> = [];
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public vendorId: number;
  public showList; displayFooter; disableStatusSubmit: boolean = false;
  public statusList: Array<any> = [];
  public DocumentList: any[] = [];
  public VendorRegList: Array<any> = [];
  public paymentTermsList: Array<any> = [];
  public VendorStatusTrackList: Array<any> = [];
  public typeOfUser: string;
  public showEdit; showDetails: boolean = false;

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");
    this.VendorRegStatus = new VendorRegStatus();
    this.VendorRegApprovalProcess = new VendorRegApprovalProcess();
    this.getVendorRegList();
    this.route.params.subscribe(params => {
      if (params["VendorId"] && !this.constants.RequisitionId) {
        this.vendorId = params["VendorId"];
        //this.vendorId = params["VendorId"];
        this.VendorData = new VendorRegistration();
        this.getVendorRegProcess();
        this.getVendorStatusTrackDetails();
        this.getStatusList();
        this.getPaymentTerms();
        this.DocumentListdata();
      }
    });
  }

  //get status list
  getStatusList() {
    this.MprService.getStatusList().subscribe(data => {
      this.statusList = data;
    })
  }
  //get Documnet List
  DocumentListdata() {
    this.spinner.show();
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from VendorRegisterDocumentDetails where  Deleteflag = 0 and VendorId =" + this.vendorId + "";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.spinner.hide();
      this.DocumentList = data;
      if (this.DocumentList.filter(li => li.DocumentationTypeId == 8).length > 0)
        this.VendorData.ESI = "1";
      else
        this.VendorData.ESI = "0";
    });
  }
  //get payment terms
  getPaymentTerms() {
    this.spinner.show();
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select *  from  VendorPaymentTerms where DeleteFlag=0";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.spinner.hide();
      this.paymentTermsList = data;
    });
  }

  getVendorRegList() {
    this.spinner.show();
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select vs.VendorId,vs.Vuserid,vm.VendorCode from  VendorUserMaster vs inner join VendorMaster vm on vm.Vendorid=vs.VendorId where VendorCode is not null";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.spinner.hide();
      this.VendorRegList = data;
    });
  }
  //term change
  termChange(term: any) {
    this.VendorData.PaymentTermId = term.PaymentTermId;
    if (term.PaymentTermId != 19) {//19:others
      this.VendorData.PaymentTerms = "";
    }

  }

  //getPaymentTerm text
  getPaymentTermTxt(PaymentTermId: any, PaymentTerms: any) {
    if (this.paymentTermsList.length > 0) {
      if (PaymentTermId == 19)
        return PaymentTerms;
      else
        return this.paymentTermsList.filter(li => li.PaymentTermId == PaymentTermId)[0].PaymentTermDescription;
    }
  }

  public bindSearchListData(name?: string, searchTxt?: string): void {
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    if (this.dynamicData.searchCondition && name == "venderid")
      this.dynamicData.searchCondition += " OR VendorCode" + " like '%" + searchTxt + "%' ";
    this.MprService.GetListItems(this.dynamicData).subscribe(data => {
      if (data.length == 0)
        this.showList = false;
      else
        this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {
        if (name == "venderid" && item["VendorCode"] != null) {
          fName = item[this.constants[name].fieldName] + " - " + item["VendorCode"];
          var value = { listName: name, name: fName, code: item[this.constants[name].fieldId], updateColumns: item[this.constants[name].updateColumns] };
          this.searchItems.push(value);
        }
        else {
          fName = item[this.constants[name].fieldName];
          var value = { listName: name, name: fName, code: item[this.constants[name].fieldId], updateColumns: item[this.constants[name].updateColumns] };
          this.searchItems.push(value);
        }
      });

    });
  }

  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;
    if (item.listName == "venderid") {
      this.VendorRegApprovalProcess.VendorId = item.code;
      this.VendorRegApprovalProcess.VendorName = this.searchresult.filter(li => li["Vendorid"] == item.code)[0]["VendorName"];
      this.vendorEmailList = item.updateColumns.split(",");
    }
    if (item.listName == "BuyerGroupId") {
      this.VendorRegApprovalProcess.BuyerGroupId = item.code;
      this.VendorRegApprovalProcess.BuyerGroupName = item.name;
    }

  }

  //clear model when search text is empty
  onsrchTxtChange(modelparm: string, value: string, model: string) {
    if (value == "") {
      this[model][modelparm] = "";
    }
  }

  selectEmails(event: any, email: any, index: number) {
    if (this.selectedEmail && event.target.checked) {
      (<HTMLInputElement>document.getElementById("email" + index)).checked = false;
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Only one mail is selected at a time' });
      return true;
    }
    if (event.target.checked) {
      this.VendorRegApprovalProcess.VendorEmailId = email;
      this.selectedEmail = email;
    } else {
      this.VendorRegApprovalProcess.VendorEmailId = "";
      this.selectedEmail = "";
    }
  }

  //Initiate Registration process to vendor
  InitiateReg() {
    if (!this.VendorData) {
      //initiate
      var isexistvendor = this.VendorRegApprovalProcess.IsExistVendor;
      this.VendorRegApprovalProcess.IsExistVendor = JSON.parse(isexistvendor.toString());
      if (this.VendorRegApprovalProcess.IsExistVendor == true) {
        //this.VendorRegApprovalProcess.VendorEmailId = this.selectedEmails.toString();
        if (!this.VendorRegApprovalProcess.VendorName) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Vendor Name' });
          return;
        }
        if (!this.VendorRegApprovalProcess.ChangesFor) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Changes' });
          return;
        }
        if (!this.VendorRegApprovalProcess.VendorEmailId) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Vendor Email' });
          return;
        }
      }
      if (this.VendorRegApprovalProcess.IsExistVendor == false) {
        if (!this.VendorRegApprovalProcess.VendorName || !this.VendorRegApprovalProcess.VendorEmailId || !this.VendorRegApprovalProcess.VendorType) {
          if (!this.VendorRegApprovalProcess.VendorName) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Vendor Name' });
            return;
          }
          if (!this.VendorRegApprovalProcess.VendorEmailId) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Vendor Email' });
            return;
          }
        }
      }
      if (!this.VendorRegApprovalProcess.VendorType) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select VendorType' });
        return;
      }
      //if (this.VendorRegList.filter(li => li.Vuserid == this.VendorRegApprovalProcess.VendorEmailId).length > 0) {
      //  this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Vendor already registerd' });
      //  return;
      //}
      this.VendorRegApprovalProcess.IntiatedBy = this.VendorRegApprovalProcess.CheckedBy = this.employee.EmployeeNo;
      this.typeOfUser = "Buyer";
    }

    //update
    if (this.VendorData) {
      if (this.typeOfUser == "Verifier" && this.VendorRegStatus.Status == "Approved" && !this.VendorData.VendorNoInSAP) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Vendor Number' });
        return;
      }
      if (!this.VendorRegStatus.Remarks) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Remarks' });
        return;
      }

      if (this.typeOfUser != "Buyer") {
        this.VendorRegApprovalProcess.IntiatorStatus = this.VendorRegApprovalProcess.CheckerStatus = this.VendorRegApprovalProcess.ApprovalStatus = this.VendorRegApprovalProcess.VerifiedStatus = this.VendorRegApprovalProcess.FinanceApprovedStatus = this.VendorRegStatus.Status;
        this.VendorRegApprovalProcess.IntiatorRemarks = this.VendorRegApprovalProcess.CheckerRemarks = this.VendorRegApprovalProcess.ApproverRemarks = this.VendorRegApprovalProcess.VerifierRemarks = this.VendorRegApprovalProcess.FinanceApprovedRemarks = this.VendorRegStatus.Remarks;
      }
      this.VendorData.Onetimevendor == true ? this.VendorRegApprovalProcess.Onetimevendor = true : this.VendorRegApprovalProcess.Onetimevendor = false;
      this.VendorData.EvaluationRequired == true ? this.VendorRegApprovalProcess.EvaluationRequired = true : this.VendorRegApprovalProcess.EvaluationRequired = false;
      this.VendorData.PerformanceVerificationRequired == true ? this.VendorRegApprovalProcess.PerformanceVerificationRequired = true : this.VendorRegApprovalProcess.PerformanceVerificationRequired = false;
      this.VendorRegApprovalProcess.VendorType == true ? this.VendorRegApprovalProcess.VendorType = true : this.VendorRegApprovalProcess.VendorType = false;

      this.VendorRegApprovalProcess.VendorNoInSAP = this.VendorData.VendorNoInSAP;
      this.VendorRegApprovalProcess.PaymentTerms = this.VendorData.PaymentTerms;
      this.VendorRegApprovalProcess.PaymentTermId = this.VendorData.PaymentTermId;
      this.VendorRegApprovalProcess.VendorId = this.vendorId;
      this.VendorRegApprovalProcess.VendorEmailId = this.VendorData.initiateVendorEmailId;
      this.VendorRegApprovalProcess.VendorName = this.VendorData.initiateVendorName;
    }
    if (this.typeOfUser == "Verifier") {
      this.VendorRegApprovalProcess.VerifiedBy = this.employee.EmployeeNo;
    }

    this.spinner.show();
    this.MprService.updateVendorRegProcess(this.VendorRegApprovalProcess, this.typeOfUser).subscribe(data => {
      this.spinner.hide();
      if (data) {
        this.VendorRegApprovalProcess = data;
        if (this.typeOfUser != "Buyer") {
          this.vendorId = data.Vendorid;
          this.getVendorRegProcess();
          if (this.VendorRegStatus.Status == "Approved" && this.typeOfUser != "Checker")
            this.displayFooter = false;
          this.messageService.add({ severity: 'success', summary: 'Sucess Message', detail: 'Status Updated' });
        }
        else {
          this.messageService.add({ severity: 'success', summary: 'Sucess Message', detail: 'Registration Intiated' });
          this.VendorRegApprovalProcess = new VendorRegApprovalProcess();
          this.selectedEmail = "";
        }
      }
    });

  }

  //get vendorRegistration details
  getVendorRegProcess() {
    this.spinner.show();
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from VendorRegProcessView where vendorid=" + this.vendorId + "";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.spinner.hide();
      this.VendorData = data[0];
      this.bindStatus();
    });
  }
  //get vendor Status track details
  getVendorStatusTrackDetails() {
    this.spinner.show();
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from VendorStatusTrackDetails where VendorId=" + this.vendorId + "";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.spinner.hide();
      this.VendorStatusTrackList = data;
    });
  }

  //enable footer based on conidtions
  bindStatus() {
    if (this.VendorData.IntiatedBy == this.employee.EmployeeNo && this.VendorData.IntiatorStatus != "Approved") {
      this.VendorRegStatus.Status = this.VendorData.IntiatorStatus;
      this.VendorRegStatus.Remarks = this.VendorData.IntiatorRemarks;
    }

    if (this.VendorData.CheckedBy == this.employee.EmployeeNo && this.VendorData.IntiatorStatus == "Approved") {
      this.VendorRegStatus.Status = this.VendorData.CheckerStatus;
      this.VendorRegStatus.Remarks = this.VendorData.CheckerRemarks;
    }
    if (this.VendorData.ApprovedBy == this.employee.EmployeeNo) {
      this.VendorRegStatus.Status = this.VendorData.ApprovalStatus;
      this.VendorRegStatus.Remarks = this.VendorData.ApproverRemarks;
    }
    if (this.VendorData.Verifier1 == this.employee.EmployeeNo || this.VendorData.Verifier2 == this.employee.EmployeeNo) {
      this.VendorRegStatus.Status = this.VendorData.VerifiedStatus;
      this.VendorRegStatus.Remarks = this.VendorData.VerifierRemarks;
    }
    if (this.VendorData.FinanceApprover == this.employee.EmployeeNo) {
      this.VendorRegStatus.Status = this.VendorData.FinanceApprovedStatus;
      this.VendorRegStatus.Remarks = this.VendorData.FinanceApprovedRemarks;
    }

    if (this.VendorData.IntiatedBy == this.employee.EmployeeNo && this.VendorData.IntiatorStatus != 'Approved' && this.VendorData.CheckerStatus != 'Approved') {
      this.displayFooter = true;
      this.typeOfUser = "Intiator";
    }

    if (this.VendorData.CheckedBy == this.employee.EmployeeNo && this.VendorData.IntiatorStatus == 'Approved' && this.VendorData.CheckerStatus != "Approved") {
      this.displayFooter = true;
      this.typeOfUser = "Checker";
    }

    if (this.VendorData.ApprovedBy == this.employee.EmployeeNo && this.VendorData.IntiatorStatus == 'Approved' && this.VendorData.CheckerStatus == 'Approved' && this.VendorData.ApprovalStatus != 'Approved') {
      this.displayFooter = true;
      this.typeOfUser = "Approver";
    }

    if ((this.VendorData.Verifier1.trim() == this.employee.EmployeeNo || this.VendorData.Verifier2.trim() == this.employee.EmployeeNo) && this.VendorData.IntiatorStatus == 'Approved' && this.VendorData.CheckerStatus == 'Approved' && this.VendorData.ApprovalStatus == 'Approved' && (this.VendorData.VerifiedStatus != 'Approved' || this.VendorData.FinanceApprovedStatus != 'Approved')) {
      this.displayFooter = true;
      this.typeOfUser = "Verifier";
    }
    if (this.VendorData.FinanceApprover == this.employee.EmployeeNo && this.VendorData.IntiatorStatus == 'Approved' && this.VendorData.CheckerStatus == 'Approved' && this.VendorData.ApprovalStatus == 'Approved' && this.VendorData.VerifiedStatus == 'Approved' && this.VendorData.FinanceApprovedStatus != 'Approved') {
      this.displayFooter = true;
      this.typeOfUser = "FinanceApprover";
    }

    if (this.typeOfUser && this.typeOfUser == 'Intiator' && (this.VendorData.CheckerStatus != 'Approved'))
      this.showEdit = true;
    if (this.typeOfUser && this.typeOfUser == 'Checker' && (this.VendorData.ApprovalStatus != 'Approved'))
      this.showEdit = true;
    if (this.typeOfUser == 'Intiator' || this.typeOfUser == 'Checker')
      this.showDetails = false;
    else
      this.showDetails = true;

    //this.displayFooter = true;
    //this.typeOfUser = "Approver";
    //this.VendorData.ApprovalStatus = "Pending";
  }

  viewDocument(path: string) {
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.Documnentpath + path1;
    window.open(path1);
  }

  dialogCancel(dialogName: string, openDialog: string) {
    this[dialogName] = false;
    this[openDialog] = true;
  }

  //navigate to approver edit page
  navigateToEditPage() {
    if (this.typeOfUser == "Checker") {
      localStorage.setItem('vendorRegDetails', JSON.stringify(this.VendorData));
      this.router.navigateByUrl('/SCM/VendorRegApprover');
    }
  }
}
