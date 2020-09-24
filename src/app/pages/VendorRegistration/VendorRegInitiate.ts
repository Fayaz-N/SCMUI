import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee, VendorRegApprovalProcess, VendorRegStatus, DynamicSearchResult, VendorRegistration } from 'src/app/Models/mpr';
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
  public vendorId: number;
  public displayFooter; disableStatusSubmit: boolean = false;
  public statusList: Array<any> = [];
  public DocumentList: any[] = [];
  public VendorRegList: Array<any> = [];
  public paymentTermsList: Array<any> = [];
  public typeOfUser: string;

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
    if (PaymentTermId == 19)
      return PaymentTerms;
    else
      return this.paymentTermsList.filter(li => li.PaymentTermId == PaymentTermId)[0].PaymentTermDescription;
  }

  //Initiate Registration process to vendor
  InitiateReg() {
    if (!this.VendorData) {
      //initiate
      if (this.VendorRegApprovalProcess.VendorName && this.VendorRegApprovalProcess.VendorEmailId) {
        if (!this.VendorRegApprovalProcess.VendorName) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Vendor Name' });
          return;
        }
        if (!this.VendorRegApprovalProcess.VendorEmailId) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Vendor Email' });
          return;
        }
      }
      if (this.VendorRegList.filter(li => li.Vuserid == this.VendorRegApprovalProcess.VendorEmailId).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Vendor already registerd' });
        return;
      }
      this.VendorRegApprovalProcess.IntiatedBy = this.VendorRegApprovalProcess.CheckedBy = this.employee.EmployeeNo;
      this.typeOfUser = "Buyer";
    }

    //update
    if (this.VendorData) {
      if (this.typeOfUser == "Verifier" && this.VendorRegStatus.Status == "Approved" && !this.VendorData.VendorNoInSAP) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Vendor Number' });
        return;
      }
      if (this.typeOfUser != "Buyer") {
        this.VendorRegApprovalProcess.CheckerStatus = this.VendorRegApprovalProcess.ApprovalStatus = this.VendorRegApprovalProcess.VerifiedStatus = this.VendorRegStatus.Status;
        this.VendorRegApprovalProcess.CheckerRemarks = this.VendorRegApprovalProcess.ApproverRemarks = this.VendorRegApprovalProcess.VerifierRemarks = this.VendorRegStatus.Remarks;
      }
      this.VendorData.Onetimevendor == true ? this.VendorRegApprovalProcess.Onetimevendor = true : this.VendorRegApprovalProcess.Onetimevendor = false;
      this.VendorData.EvaluationRequired == true ? this.VendorRegApprovalProcess.EvaluationRequired = true : this.VendorRegApprovalProcess.EvaluationRequired = false;
      this.VendorData.PerformanceVerificationRequired == true ? this.VendorRegApprovalProcess.PerformanceVerificationRequired = true : this.VendorRegApprovalProcess.PerformanceVerificationRequired = false;

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
          if (this.VendorRegStatus.Status == "Approved")
            this.disableStatusSubmit = true;
          this.messageService.add({ severity: 'success', summary: 'Sucess Message', detail: 'Status Updated' });
        }
        else
          this.messageService.add({ severity: 'success', summary: 'Sucess Message', detail: 'Registration Intiated' });
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

  //enable footer based on conidtions
  bindStatus() {
    if (this.VendorData.CheckedBy == this.employee.EmployeeNo) {
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
    if (this.VendorData.CheckedBy == this.employee.EmployeeNo && this.VendorData.CheckerStatus != 'Approved') {
      this.displayFooter = true;
      this.typeOfUser = "Checker";
    }

    if (this.VendorData.ApprovedBy == this.employee.EmployeeNo && this.VendorData.CheckerStatus == 'Approved' && this.VendorData.ApprovalStatus != 'Approved') {
      this.displayFooter = true;
      this.typeOfUser = "Approver";
    }

    if ((this.VendorData.Verifier1.trim() == this.employee.EmployeeNo || this.VendorData.Verifier2.trim() == this.employee.EmployeeNo) && this.VendorData.CheckerStatus == 'Approved' && this.VendorData.ApprovalStatus == 'Approved' && this.VendorData.VerifiedStatus != 'Approved') {
      this.displayFooter = true;
      this.typeOfUser = "Verifier";
    }
    //this.displayFooter = true;
    //this.typeOfUser = "Approver";
    //this.VendorData.ApprovalStatus = "Pending";
  }

  viewDocument(path: string) {
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.Documnentpath + path1;
    window.open(path1);
  }


  //navigate to approver edit page
  navigateToEditPage() {
    if (this.typeOfUser == "Checker" && this.VendorData.CheckerStatus != 'Approved') {
      localStorage.setItem('vendorRegDetails', JSON.stringify(this.VendorData));
      this.router.navigateByUrl('/SCM/VendorRegApprover');
    }
  }
}
