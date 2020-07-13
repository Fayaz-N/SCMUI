import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { Employee, DynamicSearchResult, searchList, MPRItemInfoes, MPRDocument, mprRevision, MPRDocumentations, MPRVendorDetail, MPRIncharge, MPRCommunication, MPRReminderTracking, VendorMaster, MPRStatusUpdate, MPRDetail, AccessList, MPRAssignment } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { element } from 'protractor';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-MPRPage',
  templateUrl: './MPRPage.component.html'
})
export class MPRPageComponent implements OnInit {
  constructor(private router: Router, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, private datePipe: DatePipe, public constants: constants, private route: ActivatedRoute, private messageService: MessageService, private spinner: NgxSpinnerService, public sanitizer: DomSanitizer) { }
  @ViewChild('dialog', { read: ElementRef, static: true })
  protected dialogElement: ElementRef;

  //variable Declarations start
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public MPRPageForm1; MPRItemDetailsForm; MPRPageForm2; MPRInchargeForm; MPRPageForm3; MPRCommunicationForm; newVendor; POraiseForm; MPRStatus: FormGroup;
  public showMaterialForm; showVendorForm; showOtherDetailsForm; communicationFormEdit; showCommunicationForm: boolean = false;
  public form1Edit; materialFormEdit; vendorFormEdit; form3Edit; showForm1EditBtn; showMaterialEditBtn; showVendorEditBtn; shoForm3EditBtn; showCommEditBtn: boolean = false;
  public MPRForm1Submitted; MPRItemDetailsSubmitted; vendorSubmitted; MPRForm2Submitted; MPRForm3Submitted; MPRCommunicationSubmitted = false;
  public displayInchargeDialog; showVendorDialog; showDocumentationDialog; displayCommunicationDialog; showPOordingDialog; showManualStatusgDialog; showFileViewer: boolean = false;
  public showRfqGen; showCompareRfq; hideDeleteBtn: boolean = false;
  public dynamicData = new DynamicSearchResult();
  public searchItems: Array<searchList> = [];
  public searchresult: Array<object> = [];
  public itemDetails: MPRItemInfoes;
  public mprDocuments: MPRDocument;
  public selectedItem: searchList;
  public selectedmultiItem: searchList;
  public showList: boolean = false;
  public selectedlist: Array<searchList> = [];
  public formEdit = false;
  public formName; statusAckTxt: string = "Acknowledge";
  public txtName: string;
  public mprRevisionModel: mprRevision;
  public mprRevisionList: Array<mprRevision> = [];
  public mprRevisionDetails: mprRevision;
  public dialogTop: string;
  public displayItemDialog: boolean = false;
  public showDocumentUpload: boolean;
  public MPR3Documents: Array<MPRDocument> = [];
  public MPRDocumentations: MPRDocumentations;
  public vendorDetails: MPRVendorDetail;
  public justificationDisply: boolean = true;
  public specifyDispatchDisply: boolean = true;
  public numbers: Array<number> = [];
  public mprIncharges: MPRIncharge;
  public MPRCommunications: MPRCommunication;
  public MPRAssignment: MPRAssignment;
  public MPRReminderTrackings: MPRReminderTracking;
  public EmployeeList: Array<any> = [];
  public mprStatusUpdate: MPRStatusUpdate;
  public statusList: Array<any> = [];
  public displayFooter: boolean;
  public disableStatusSubmit: boolean = false;
  public showAcknowledge; showStatusDetails; showPage; rfqGenerated; rfqResponded; rfqRaised: boolean = false;
  public doc: SafeResourceUrl;
  public showNewVendor: boolean = false;
  public newVendorDetails: VendorMaster;
  public RfqGeneratedList: Array<any> = [];
  public PAdetailsList: Array<any> = [];
  public RepeatOrderList: Array<MPRItemInfoes> = [];
  public RepeatOrder; showraisePo; showManualStatus; showPALink; deleteDocument; viewRfq; editRfq: boolean = false;
  public vendorEmailList: Array<any> = [];
  public DispatchLocation; currentStatus: string = "";
  public rfqCommunicationList: Array<any> = [];

  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));

    else
      this.router.navigateByUrl("Login");
    if (localStorage.getItem("AccessList")) {
      this.AccessList = JSON.parse(localStorage.getItem("AccessList"));
    }

    this.mprRevisionModel = new mprRevision();
    this.mprRevisionModel.MPRDetail = new MPRDetail();
    this.itemDetails = new MPRItemInfoes();
    this.mprDocuments = new MPRDocument();
    this.vendorDetails = new MPRVendorDetail();
    this.MPRDocumentations = new MPRDocumentations();
    this.mprIncharges = new MPRIncharge();
    this.MPRCommunications = new MPRCommunication();
    this.MPRReminderTrackings = new MPRReminderTracking();
    this.mprStatusUpdate = new MPRStatusUpdate();
    this.mprRevisionDetails = new mprRevision();
    this.newVendorDetails = new VendorMaster();
    this.RfqGeneratedList = [];
    this.PAdetailsList = [];
    this.rfqCommunicationList = [];
    this.MPRAssignment = new MPRAssignment();
    //create static drop down text from 0 to 100
    Array(100).fill(1).map((x, i) => {
      this.numbers.push(i);
    });

    //form 1 validation declararion.
    this.MPRPageForm1 = this.formBuilder.group({
      docNo: ['', [Validators.required]],
      DocumentDescription: ['', [Validators.required]],
      IssuePurposeId: ['', [Validators.required]],
      DepartmentId: ['', [Validators.required, this.noWhitespaceValidator]],
      ProjectManager: ['', [Validators.required, this.noWhitespaceValidator]],
      JobCode: ['', [Validators.required]],
      JobName: ['', [Validators.required]],
      GEPSApprovalId: ['', [Validators.required]],
      SaleOrderNo: ['', [Validators.required]],
      ClientName: ['', [Validators.required, this.noWhitespaceValidator]],
      PlantLocation: ['', [Validators.required]],
      BuyerGroupId: ['', [Validators.required, this.noWhitespaceValidator]],
    });

    //MPRItemDetailsForm validation declararion.
    this.MPRItemDetailsForm = this.formBuilder.group({
      ItemId: ['', [Validators.required, this.noWhitespaceValidator]],
      ItemDescription: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      UnitId: ['', [Validators.required]],
      SOLineItemNo: ['', [Validators.required]],
      MfgPartNo: ['', [Validators.required]],
      MfgModelNo: ['', [Validators.required]],
      ReferenceDocNo: ['', [Validators.required]],
      TargetSpend: ['', [Validators.required]]

    });

    //MPRPageForm2 validation declararion.
    this.MPRPageForm2 = this.formBuilder.group({
      TargetSpend: ['', [Validators.required]],
      TargetedSpendRemarks: ['', [Validators.required]],
      PurchaseTypeId: ['', [Validators.required]],
      PreferredVendorTypeId: ['', [Validators.required]],
      JustificationForSinglePreferredVendor: ['', [Validators.required]],
    });

    this.MPRInchargeForm = this.formBuilder.group({
      Incharge: ['', [Validators.required]],
      CanClearTechnically: ['', [Validators.required]],
      CanClearCommercially: ['', [Validators.required]],
      CanReceiveMailNotification: ['', [Validators.required]]
    });
    //MPRPageForm3 validation declarations.
    this.MPRPageForm3 = this.formBuilder.group({
      DeliveryRequiredBy: ['', [Validators.required]],
      DispatchLocation: ['', [Validators.required]],
      specifyDispatchLocation: ['', [Validators.required]],
      ScopeId: ['', [Validators.required]],
      TrainingRequired: ['', [Validators.required]],
      TrainingManWeeks: ['', [Validators.required]],
      TrainingRemarks: ['', [Validators.required]],
      BoolDocumentationApplicable: ['', [Validators.required]],
      supplyMonths: ['', [Validators.required]],
      commissionMonths: ['', [Validators.required]],
      GuaranteePeriod: ['', [Validators.required]],
      //NoOfSetsOfQAP: ['', [Validators.required]],
      InspectionRequired: ['', [Validators.required]],
      InspectionComments: ['', [Validators.required]],
      InspectionRemarks: ['', [Validators.required]],
      NoOfSetsOfTestCertificates: ['', [Validators.required]],
      ProcurementSourceId: ['', [Validators.required]],
      CustomsDutyId: ['', [Validators.required]],
      //ProjectDutyApplicableId: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
      CheckedBy: ['', [Validators.required]],
      ApprovedBy: ['', [Validators.required]]
    });

    this.MPRCommunicationForm = this.formBuilder.group({
      Remarks: ['', [Validators.required]],
      setReminder: ['', [Validators.required]],
      sendemail: ['', [Validators.required]],
      ReminderDate: ['', [Validators.required]],
      toEmail: ['', [Validators.required]],
      ccEmail: ['', [Validators.required]]

    })

    this.newVendor = this.formBuilder.group({
      VendorName: ['', [Validators.required]],
      Emailid: ['', [Validators.required]],
      ContactNo: ['', [Validators.required, Validators.maxLength(10)]]
    })
    this.POraiseForm = this.formBuilder.group({
      ORemarks: ['', [Validators.required]],
      OCheckedBy: ['', [Validators.required]],
      OApprovedBy: ['', [Validators.required]],
      OSecondApprover: ['', [Validators.required]],
      OThirdApprover: ['', [Validators.required]]
    })
    this.MPRStatus = this.formBuilder.group({
      Remarks: ['', [Validators.required]],
      MPRStatus: ['', [Validators.required]]
    })



    //remove validation for unwanted fields.
    this.MPRPageForm1.controls['docNo'].clearValidators();
    this.MPRPageForm1.controls['JobCode'].clearValidators();
    this.MPRPageForm1.controls['JobName'].clearValidators();
    this.MPRPageForm1.controls['GEPSApprovalId'].clearValidators();
    this.MPRPageForm1.controls['docNo'].clearValidators();
    this.MPRPageForm1.controls['JobCode'].clearValidators();
    this.MPRItemDetailsForm.controls['SOLineItemNo'].clearValidators();
    this.MPRItemDetailsForm.controls['MfgPartNo'].clearValidators();
    this.MPRItemDetailsForm.controls['MfgModelNo'].clearValidators();
    this.MPRItemDetailsForm.controls['ReferenceDocNo'].clearValidators();
    this.MPRItemDetailsForm.controls['TargetSpend'].clearValidators();
    this.MPRPageForm1.controls['SaleOrderNo'].clearValidators();
    this.MPRPageForm1.controls['PlantLocation'].clearValidators();
    this.MPRPageForm2.controls['TargetSpend'].clearValidators();
    this.MPRPageForm2.controls["TargetedSpendRemarks"].clearValidators();
    this.MPRPageForm3.controls['GuaranteePeriod'].clearValidators();
    this.MPRPageForm3.controls['TrainingManWeeks'].clearValidators();
    this.MPRPageForm3.controls['InspectionComments'].clearValidators();
    this.MPRPageForm3.controls['supplyMonths'].clearValidators();
    this.MPRPageForm3.controls['commissionMonths'].clearValidators();
    this.MPRPageForm3.controls['TrainingRemarks'].clearValidators();
    this.MPRPageForm3.controls['InspectionRemarks'].clearValidators();
    this.MPRPageForm3.controls['Remarks'].clearValidators();
    this.MPRCommunicationForm.controls['ccEmail'].clearValidators();
    this.POraiseForm.controls['ORemarks'].clearValidators();
    this.POraiseForm.controls['OSecondApprover'].clearValidators();
    this.POraiseForm.controls['OThirdApprover'].clearValidators();

    if (localStorage.getItem("EmployeeList"))
      this.EmployeeList = JSON.parse(localStorage.getItem("EmployeeList"));
    else {
      this.MprService.getEmployeeList().subscribe(data => {
        this.EmployeeList = data;
        var list = this.EmployeeList.filter(li => li.Grade == 'M1');
        localStorage.setItem("EmployeeList", JSON.stringify(list));
      });
    }
    this.route.params.subscribe(params => {
      if (params["MPRRevisionId"] && !this.constants.RequisitionId) { //load mpr revision data 
        var revisionId = params["MPRRevisionId"];
        this.spinner.show();
        this.loadMPRData(revisionId);
        this.getRfqGeneratedList(revisionId);
        this.getPAdetails(revisionId);
        this.getCommunicationList();
      }
      else {
        if (params["MPRRevisionId"] && this.constants.RequisitionId) { //revise mpr
          this.showPage = true;
          this.mprRevisionModel.RevisionId = 0;
          this.mprRevisionModel.RequisitionId = parseInt(this.constants.RequisitionId);
        }
        else {
          //show mpr new form from new mpr page
          if (this.constants.newMpr) {
            this.showPage = true;
            this.constants.newMpr = false;
          }
          else {
            //check count of MPR Pending List
            var preapredBy = this.employee.EmployeeNo.toString();
            this.MprService.ChechMPRlendingList(preapredBy).subscribe(data => {
              if (data > 0) {
                this.router.navigateByUrl('/SCM/MPRPendingList');
              }
              else
                this.showPage = true;
            });
          }
        }
      }
      this.getStatusList();
    });

  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  //on search list dialog show event
  onSearhListDialogShow() {
    setTimeout(() => {
      //this.dialogElement.nativeElement.children[0].style.top = this.dialogTop;
    }, 10);
  }


  //Binding searchList data
  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    //if (e.type == "keyup" && searchTxt && searchTxt.length < 3)
    //  return;
    this.formName = formName;
    this.dialogTop = e.clientY + 30 + "px";
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    searchTxt = searchTxt.replace('*', '%');
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    if (this.dynamicData.searchCondition && name == "ItemId")
      this.dynamicData.searchCondition += " OR Material" + " like '%" + searchTxt + "%'" + "group by Material";

    if (this.dynamicData.searchCondition && name == "ClientName") {
      //this.dynamicData.searchCondition += " OR YGSSAPCustomerCode" + " like '" + searchTxt + "%'";
      this.dynamicData.searchCondition += " OR YGSSAPCustomerCode" + " like '%" + searchTxt + "%'" + " OR Address1" + " like '%" + searchTxt + "%'" + " OR Address2" + " like '%" + searchTxt + "%'" + " OR Address3" + " like '%" + searchTxt + "%'" + " OR City" + " like '%" + searchTxt + "%'";
      //this.dynamicData.searchCondition += " OR Address1" + " like '" + searchTxt + "%'";
    }

    if (name == "MPRStatus")
      this.dynamicData.searchCondition += " Order By OrderIndex";
    else
      this.dynamicData.searchCondition += " Order By " + this.constants[name].fieldName + "";
    if (name == "ItemId")
      this.dynamicData.query = "select  MAX(RFQRevisions_N.RFQType) as RFQType,MAX(RFQRevisions_N.QuoteValidTo) as QuoteValidTo, Material,MAX(Materialdescription) as Materialdescription from MaterialMasterYGS left join RFQItems_N on RFQItems_N.ItemId =MaterialMasterYGS.Material left join RFQRevisions_N on RFQRevisions_N.rfqRevisionId =RFQItems_N.RFQRevisionId" + this.dynamicData.searchCondition + " ";
    this.MprService.GetListItems(this.dynamicData).subscribe(data => {
      //if (data.length == 0)
      //  this.showList = false;
      //else
      this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {
        if (name == 'ClientName') {
          fName = item["YGSSAPCustomerCode"] + " | " + item[this.constants[name].fieldName];
          if (item["Address1"])
            fName += " | " + item["Address1"];
          if (item["Address2"])
            fName += item["Address2"];
          if (item["Address3"])
            fName += item["Address3"];
          if (item["City"])
            fName += " | " + item["City"];
          if (item["PostalCode"])
            fName += " - " + item["PostalCode"];
          if (item["CustomerCountry"])
            fName += " | " + item["CustomerCountry"];
        }
        // fName = item[this.constants[name].fieldName] + " - " + item["YGSSAPCustomerCode"];
        else if (name == "venderid") {
          fName = item[this.constants[name].fieldName] + " - " + item["VendorCode"];
        }
        else if (name == "ItemId") {
          fName = item[this.constants[name].fieldName] + " - " + item[this.constants[name].fieldId];
          if (item["RFQType"] == "Rate Contract")
            fName += " - " + "RC";
          if (item["QuoteValidTo"]) {
            var date = this.datePipe.transform(item["QuoteValidTo"], this.constants.dateFormat);
            fName += " - " + date;
          }
        }
        else
          fName = item[this.constants[name].fieldName];
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId], updateColumns: item[this.constants[name].updateColumns] };
        this.searchItems.push(value);
      });
      if (this.selectedlist.length > 0) {
        var list = this.selectedlist.filter(li => li.listName == name);
        if (list.length > 0)
          this.selectedItem = this.searchItems.filter(li => li.code == list[0].code)[0];
      }
      if (this.mprRevisionModel[name] != null)
        this.selectedItem = this.searchItems.filter(li => li.code == this.mprRevisionModel[name])[0];
      if (callback)
        callback();
    });
  }

  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;
    if (item.listName == "ItemId" || item.listName == "UnitId")
      this.itemDetails[this.txtName] = item.code;
    if (item.listName == "venderid") {
      if (this.mprRevisionModel.MPRVendorDetails.filter(li => li.Vendorid == item.code).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'vendor already exist' });
        return false;
      }
      if (item.updateColumns && item.updateColumns != "NULL") {
        this.vendorEmailList = item.updateColumns.split(",");
        this.newVendorDetails.Emailid = this.vendorEmailList[0];
        // this.newVendorDetails.Emailid = item.updateColumns;

      }
      this.newVendorDetails.Vendorid = item.code;
      this.newVendor.controls['ContactNo'].clearValidators();
      this.newVendor.controls['VendorName'].clearValidators();
      this.newVendor.controls['ContactNo'].updateValueAndValidity();
      this.newVendor.controls['VendorName'].updateValueAndValidity();
      this.vendorDetails.Vendorid = item.code;
      this.vendorDetails.VendorName = item.name;
      this.vendorDetails.UpdatedBy = this.employee.EmployeeNo;
      //this.mprRevisionModel.MPRVendorDetails.push(this.vendorDetails);
    }
    if (item.listName == "DocumentationDescriptionId") {
      this.MPRDocumentations.DocumentationDescriptionId = item.code;
      this.MPRDocumentations.DocumentationDescription = item.name;
    }
    if (item.listName == "Incharge")
      this.mprIncharges[this.txtName] = item.code;
    //Communication Block
    if (item.listName == "toEmail" || item.listName == "ccEmail") {
      if (this.MPRCommunications.MPRReminderTrackings.filter(li => li.MailTo == item.code).length > 0) {
        alert("Person already exist");
        return false;
      }
      else {
        this.MPRReminderTrackings = new MPRReminderTracking();
        this.MPRReminderTrackings.MailTo = item.code;
        if (item.listName == "toEmail")
          this.MPRReminderTrackings.MailAddressType = "To";
        if (item.listName == "ccEmail")
          this.MPRReminderTrackings.MailAddressType = "CC";

        if (this.MPRCommunications.SendEmail == true)
          this.MPRReminderTrackings.MailSentOn = new Date();
        this.MPRCommunications.MPRReminderTrackings.push(this.MPRReminderTrackings);
      }
    }

    if (this.formName != "") {
      this[this.formName].controls[this.txtName].setValue(item.name);
      this[this.formName].controls[this.txtName].errors = null;
      this[this.formName].controls[this.txtName].status = 'VALID';
      this[this.formName].value[this.txtName] = item.name
      this.mprRevisionModel[this.txtName] = item.code;
    }
    if (this.formName == "MPRPageForm2" && item.listName == "PurchaseTypeId") {
      if (item.code == 1 || item.code == 2) {
        this.justificationDisply = false;
        this.MPRPageForm2.controls['JustificationForSinglePreferredVendor'].setValidators([Validators.required]);
      }
      else {
        this.justificationDisply = true;
        this.MPRPageForm2.controls['JustificationForSinglePreferredVendor'].setValue("");
        this.MPRPageForm2.controls['JustificationForSinglePreferredVendor'].clearValidators();

      }
      this.MPRPageForm2.controls['JustificationForSinglePreferredVendor'].updateValueAndValidity()
    }

    if (this.formName == "MPRPageForm3" && item.listName == "DispatchLocation") {
      this.MPRPageForm3.controls['specifyDispatchLocation'].setValue("");
      if (item.code == 3 || item.code == 1) {//1:site,3:others
        this.specifyDispatchDisply = false;
        this.MPRPageForm3.controls['specifyDispatchLocation'].setValidators([Validators.required]);
      }
      else {
        this.mprRevisionModel.DispatchLocation = item.name;
        this.specifyDispatchDisply = true;
        //this.MPRPageForm3.controls['specifyDispatchLocation'].setValue("");
        this.MPRPageForm3.controls['specifyDispatchLocation'].clearValidators();

      }

      this.MPRPageForm3.controls['specifyDispatchLocation'].updateValueAndValidity();
    }

    if (this.txtName == "InchargeName") {
      this.mprRevisionModel.MPRIncharges = [];
      item.forEach(items => {
        this.mprIncharges = new MPRIncharge();
        this.mprIncharges.Incharge = items.code;
        this.mprIncharges.CanClearTechnically = false;
        this.mprIncharges.CanClearCommercially = false;
        this.mprIncharges.CanReceiveMailNotification = false;
        this.mprRevisionModel.MPRIncharges.push(this.mprIncharges);
      });
    }
    if (item.listName != "InchargeName") {
      var index = this.selectedlist.findIndex(x => x.listName == item.listName);
      if (index > -1)
        this.selectedlist.splice(index, 1);
      this.selectedlist.push(item);
    }
    if (item.listName == "MPRStatus") {
      this.mprStatusUpdate.status = item.name;
      this.mprStatusUpdate.StatusId = item.code;
    }
    if (this.formName == "") {
      if (item.listName == "AssignEmployee") {
        if (this.mprStatusUpdate.MPRAssignments.filter(li => li.Employeeno == item.code).length > 0) {
          alert("Empployee already exist");
          return false;
        }

        this.mprStatusUpdate.BuyerGroupName = "";
        this.mprStatusUpdate.BuyerGroupId = null;
        this.statusAckTxt = "Acknowledge";
        this.mprStatusUpdate.EmployeeName = item.name;
        this.MPRAssignment = new MPRAssignment();
        this.MPRAssignment.MprRevisionId = this.mprRevisionModel.RevisionId;
        this.MPRAssignment.Employeeno = item.code;
        this.MPRAssignment.EmployeeName = item.name;
        this.mprStatusUpdate.MPRAssignments.push(this.MPRAssignment);
      }
      else {
        if (item.listName == "BuyerGroupId") {
          if (this.mprRevisionModel.BuyerGroupId == item.code) {
            alert("Buyer Group already exist");
            return false;
          }
        }
        this.mprStatusUpdate.BuyerGroupName = item.name;
        this.mprStatusUpdate.BuyerGroupId = item.code;
        this.statusAckTxt = "Change Buyer Group";
      }
    }

  }

  //clear model when search text is empty
  onsrchTxtChange(modelparm: string, model: string) {
    //if (value == "") {
    this[model][modelparm] = "";
    //}
  }

  //form1 code started

  onMPRForm1Submit(formId, showform, formEdit: string) {
    this.MPRForm1Submitted = true;
    if (this.MPRPageForm1.invalid || (!this.mprRevisionModel.DepartmentId || !this.mprRevisionModel.ProjectManager || !this.mprRevisionModel.ClientName || !this.mprRevisionModel.BuyerGroupId)) {
      return;
    }
    else {
      this.mprRevisionModel.PreparedBy = this.employee.EmployeeNo;
      this.mprRevisionModel.PreparedOn = new Date();
      this.spinner.show();
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
        this.spinner.hide();
        this.mprRevisionModel = data;
        this.animateCSS(formId, 'slideInRight');
        //document.getElementById(formId).animate([{ transform: 'translateX(500px)' }, { transform: 'translateX(0px)' }], { duration: 500 })
        this[formEdit] = true;
        this[showform] = true;
        setTimeout(() => {
          document.getElementById("MPRMaterialId").scrollIntoView(false);
        }, 100);
      });
    }
  }

  // edit icon click event
  onFormEdit(form, formId) {
    this[form] = false;
    this.animateCSS(formId, 'slideInLeft');
    //document.getElementById(formId).animate([{ transform: 'translateX(-500px)' }, { transform: 'translateX(0px)' }], { duration: 500 })
  }

  //form 2 code

  //open dialog box to add item details
  showItemDialogToAdd(dialog: string) {
    this.itemDetails = new MPRItemInfoes();
    this.MPRItemDetailsForm.controls.ItemId.value = "";
    this.MPRItemDetailsForm.controls.UnitId.value = "";
    var index = this.selectedlist.findIndex(x => x.listName == 'ItemId');
    if (index > -1)
      this.selectedlist.splice(index, 1);
    var index1 = this.selectedlist.findIndex(x => x.listName == 'UnitId');
    if (index1 > -1)
      this.selectedlist.splice(index1, 1);
    this.selectedItem = new searchList();
    this[dialog] = true;
  }

  showInchargeDialogToAdd(dialog: string) {
    this.mprIncharges = new MPRIncharge();
    this.mprIncharges.CanReceiveMailNotification = true;
    this.MPRInchargeForm.controls.Incharge.value = "";
    var index = this.selectedlist.findIndex(x => x.listName == 'Incharge');
    if (index > -1)
      this.selectedlist.splice(index, 1);
    this.selectedItem = new searchList();
    this[dialog] = true;
  }

  calculateTargetSpend() {
    if (this.mprRevisionModel.MPRItemInfoes.length > 0)
      return this.mprRevisionModel.MPRItemInfoes.map(li => li.TargetSpend).reduce((prev, next) => prev + next);
  }

  onRowEditInit(e: any, formName: string, details: MPRItemInfoes) {
    this.displayItemDialog = true;
    this.itemDetails = new MPRItemInfoes();
    this.itemDetails = details;
    this.bindSearchListData(e, formName, 'ItemId', "", (): any => {
      this.showList = false;
      if (details.Itemid == "0000")
        this.MPRItemDetailsForm.controls.ItemId.value = "NewItem";
      else {
        if (this.searchItems.filter(li => li.listName == "ItemId" && li.code == details.Itemid)[0])
          this.MPRItemDetailsForm.controls.ItemId.value = this.searchItems.filter(li => li.listName == "ItemId" && li.code == details.Itemid)[0].name;
      }
      this.MPRItemDetailsForm.value.ItemId = details.Itemid;
      this.MPRItemDetailsForm.controls['ItemId'].updateValueAndValidity()
    });
    if (details.UnitId) {
      this.bindSearchListData(e, formName, 'UnitId', "", (): any => {
        this.showList = false;
        this.MPRItemDetailsForm.controls.UnitId.value = this.searchItems.filter(li => li.listName == "UnitId" && li.code == details.UnitId)[0].name;
        this.MPRItemDetailsForm.value.UnitId = details.UnitId;
        this.MPRItemDetailsForm.controls['UnitId'].updateValueAndValidity()
      });
    }
  }

  onMPRInfoDelete(details: MPRItemInfoes, index: number) {
    this.MprService.deleteMPRItemInfo(details).subscribe(data => {
      if (data == true)
        this.mprRevisionModel.MPRItemInfoes.splice(index, 1);
    });
  }

  removeDoument(details: MPRDocument) {
    var index = this.mprRevisionModel.MPRDocuments.findIndex(x => x.MprDocId == details.MprDocId);
    if (details.MprDocId) {
      this.spinner.show();
      this.MprService.deleteMPRDocument(details).subscribe(data => {
        this.spinner.hide();
        if (data == true) {
          this.mprRevisionModel.MPRDocuments.splice(index, 1);
          this.MPR3Documents = this.mprRevisionModel.MPRDocuments.filter(li => li.DocumentTypeid == 2);
        }
      });
    }
    else {
      this.mprRevisionModel.MPRDocuments.splice(index, 1);
      this.MPR3Documents = this.mprRevisionModel.MPRDocuments.filter(li => li.DocumentTypeid == 2);
    }
  }

  EditVendor(dialogName: string, vendorDetails: MPRVendorDetail) {
    this.vendorDetails.VendorDetailsId = vendorDetails.VendorDetailsId;
    this.vendorDetails.Vendorid = vendorDetails.Vendorid;
    this.vendorDetails.VendorName = vendorDetails.VendorMaster.VendorName;
    this.vendorDetails.UpdatedBy = this.employee.EmployeeNo;
    this.newVendorDetails.Vendorid = vendorDetails.Vendorid;
    this.vendorEmailList = vendorDetails.VendorMaster.Emailid.split(",");
    this.newVendorDetails.Emailid = this.vendorEmailList[0];
    this.newVendor.controls['ContactNo'].clearValidators();
    this.newVendor.controls['ContactNo'].updateValueAndValidity();
    this.newVendor.controls['VendorName'].setValue(this.vendorDetails.VendorName);
    this[dialogName] = true;
  }

  removeVendor(details: MPRVendorDetail) {
    var index = this.mprRevisionModel.MPRVendorDetails.findIndex(x => x.VendorDetailsId == details.VendorDetailsId);
    if (details.VendorDetailsId) {
      this.spinner.show();
      this.MprService.deleteMPRVendor(details).subscribe(data => {
        this.spinner.hide();
        if (data == true) {
          this.mprRevisionModel.MPRVendorDetails.splice(index, 1);

        }
      });
    }
    else {
      this.mprRevisionModel.MPRVendorDetails.splice(index, 1);

    }
  }

  onMPRMaterialSubmit(formId: string, showform: string, formEdit: string) {
    // this.MPRForm2Submitted = true;
    this.animateCSS(formId, 'slideInRight');
    // document.getElementById(formId).animate([{ transform: 'translateX(500px)' }, { transform: 'translateX(0px)' }], { duration: 500 })
    this[formEdit] = true;
    this[showform] = true;
    setTimeout(() => {
      document.getElementById("MPRVendorId").scrollIntoView(false);
    }, 10);
  }

  onMPRVendorSubmit(formId: string, showform: string, formEdit: string) {
    this.MPRForm2Submitted = true;
    if (this.MPRPageForm2.invalid) {
      return;
    }
    else {
      this.mprRevisionModel.MPRItemInfoes = [];
      this.mprRevisionModel.MPRDocuments = [];
      this.mprRevisionModel.MPRDocumentations = [];
      this.mprRevisionModel.MPRIncharges = [];
      this.mprRevisionModel.MPRCommunications = [];
      this.spinner.show();
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
        this.spinner.hide();
        this.mprRevisionModel = data;
        this.animateCSS(formId, 'slideInRight');
        //document.getElementById(formId).animate([{ transform: 'translateX(500px)' }, { transform: 'translateX(0px)' }], { duration: 500 })
        this[formEdit] = true;
        this[showform] = true;
      });
    }
  }

  //form 3 code
  removeDoumentation(details: MPRDocumentations) {
    var index = this.mprRevisionModel.MPRDocumentations.findIndex(x => x.DocumentationId == details.DocumentationId);
    if (details.DocumentationId) {
      this.spinner.show();
      this.MprService.deleteDocumentation(details).subscribe(data => {
        this.spinner.hide();
        if (data == true) {
          this.mprRevisionModel.MPRDocumentations.splice(index, 1);
          //this.MPR3Documents = this.mprRevisionModel.MPRDocumentations.filter(li => li.DocumentTypeid == 2);
        }
      });
    }
    else {
      this.mprRevisionModel.MPRDocumentations.splice(index, 1);

    }
  }

  trainingRequiredChange() {
    if (this.mprRevisionModel.TrainingRequired) {
      this.MPRPageForm3.controls['TrainingManWeeks'].setValidators([Validators.required]);
    }
    else {
      this.MPRPageForm3.controls['TrainingManWeeks'].clearValidators();
      this.mprRevisionModel.TrainingManWeeks = 0;
      this.mprRevisionModel.TrainingRemarks = "";
    }
    this.MPRPageForm3.controls['TrainingManWeeks'].updateValueAndValidity()
  }
  guranteeChanges() {
    if (this.mprRevisionModel.GuaranteePeriod[0] == "Not Applicable") {
      this.MPRPageForm3.controls["supplyMonths"].setValue("");
      this.MPRPageForm3.controls["commissionMonths"].setValue("");
      //this.MPRPageForm3.controls["supplyMonths"].clearValidators();
      //this.MPRPageForm3.controls["commissionMonths"].clearValidators();
      //this.MPRPageForm3.controls["GuaranteePeriod"].setValidators([Validators.required]);
      this.mprRevisionModel.GuaranteePeriod == "Not Applicable";
    }
    else {
      this.MPRPageForm3.controls["GuaranteePeriod"].setValue("");
      //this.MPRPageForm3.controls["GuaranteePeriod"].clearValidators();
      //this.MPRPageForm3.controls["supplyMonths"].setValidators([Validators.required]);
      //this.MPRPageForm3.controls["commissionMonths"].setValidators([Validators.required]);
    }
    this.MPRPageForm3.controls['supplyMonths'].updateValueAndValidity();
    this.MPRPageForm3.controls['commissionMonths'].updateValueAndValidity();
    this.MPRPageForm3.controls['GuaranteePeriod'].updateValueAndValidity();
  }
  inspectionChanges(event: any) {
    if (this.mprRevisionModel.InspectionRequired && this.mprRevisionModel.InspectionComments == "Inspection & Test shall be carried out in accordance with the mutually agreed procedure")
      this.mprRevisionModel.NoOfSetsOfTestCertificates = null;
  }

  monthChanges() {
    this.mprRevisionModel.GuaranteePeriod = "";
  }


  onInchargeDeatilsSubmit(dialog: string) {

    this.mprIncharges.RevisionId = this.mprRevisionModel.RevisionId;
    this.mprRevisionModel.MPRItemInfoes = [];
    this.mprRevisionModel.MPRDocuments = [];
    this.mprRevisionModel.MPRDocumentations = [];
    this.mprRevisionModel.MPRVendorDetails = [];
    this.mprRevisionModel.MPRCommunications = [];
    this.mprRevisionModel.MPRIncharges = [];
    this.mprRevisionModel.MPRIncharges.push(this.mprIncharges);
    this.spinner.show();
    this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
      this.spinner.hide();
      this.mprRevisionModel.MPRIncharges = data.MPRIncharges;
      this[dialog] = false;
    });

  }

  onItemDeatilsSubmit() {
    if (this.MPRItemDetailsForm.invalid) {
      this.MPRItemDetailsSubmitted = true;
      return;
    }
    else {
      if (this.itemDetails.ItemId)
        this.itemDetails.Itemid = this.itemDetails.ItemId;
      if (!this.itemDetails.Itemid) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select item from the list' });
        return;
      }
      if (!this.itemDetails.UnitId) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Units from the list' });
        return;
      }
      this.MPRItemDetailsSubmitted = false;
      this.itemDetails.RevisionId = this.mprRevisionModel.RevisionId;
      this.mprRevisionModel.MPRItemInfoes = [];
      this.mprRevisionModel.MPRItemInfoes.push(this.itemDetails);
      this.mprRevisionModel.MPRDocuments = this.mprRevisionModel.MPRDocuments.filter(li => li.ItemDetailsId == this.itemDetails.Itemdetailsid);
      this.spinner.show();
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
        this.spinner.hide();
        this.mprRevisionModel = data;
        this.displayItemDialog = false;
      });
    }
  }

  onMPRForm3Submit(formId: string, formEdit: string) {
    this.MPRForm3Submitted = true;
    if (this.specifyDispatchDisply == false)
      this.mprRevisionModel.DispatchLocation = this.DispatchLocation;
    if (this.MPRPageForm3.invalid || (!this.mprRevisionModel.DispatchLocation || !this.mprRevisionModel.ScopeId || !this.mprRevisionModel.ProcurementSourceId || !this.mprRevisionModel.CustomsDutyId || !this.mprRevisionModel.CheckedBy || !this.mprRevisionModel.ApprovedBy)) {
      document.getElementById("MPRPageForm3").scrollIntoView(true);
      return;
    }
    else {
      if (this.mprRevisionModel.GuaranteePeriod && this.mprRevisionModel.GuaranteePeriod[0])
        this.mprRevisionModel.GuaranteePeriod = this.mprRevisionModel.GuaranteePeriod[0];
      if (this.MPRPageForm3.value.supplyMonths && this.MPRPageForm3.value.commissionMonths)
        this.mprRevisionModel.GuaranteePeriod = this.MPRPageForm3.value.supplyMonths + " " + "months after supply or " + this.MPRPageForm3.value.commissionMonths + " " + "months after commissioning whichever is earlier";
      if (this.mprRevisionModel.InspectionComments)
        this.mprRevisionModel.InspectionComments = this.mprRevisionModel.InspectionComments[0];
      this.mprRevisionModel.PreparedBy = this.employee.EmployeeNo;
      this, this.mprRevisionModel.PreparedOn = new Date();
      this.spinner.show();
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
        this.spinner.hide();
        this.loadMPRData(this.mprRevisionModel.RevisionId);
        this.mprRevisionModel = data;
        this.animateCSS(formId, 'slideInRight');
        //document.getElementById(formId).animate([{ transform: 'translateX(500px)' }, { transform: 'translateX(0px)' }], { duration: 500 })
        this[formEdit] = true;
        setTimeout(() => {
          document.getElementById("MPRPageForm1").scrollIntoView(false);
        }, 10);
      });
    }
  }

  dialogCancel(dialogName) {
    this[dialogName] = false;
  }

  openMPR3Dialog(dialogName: string) {
    //this.enableVendorAdd(dialogName);
    this[dialogName] = true;
    this.vendorDetails = new MPRVendorDetail();
    this.newVendorDetails = new VendorMaster();
    this.vendorEmailList = [];
  }


  onDocumentSubmit(dialogName: string, type: string) {
    if (type == "vendorDetails") {
      this.vendorSubmitted = true;
      if (this.newVendor.invalid) {
        return;
      }
      else {
        if (this.vendorEmailList.length == 0) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Click add  button to add mails.' });
          return;
        }
        this.mprRevisionModel.MPRItemInfoes = [];
        this.mprRevisionModel.MPRDocuments = [];
        this.mprRevisionModel.MPRDocumentations = [];
        this.newVendorDetails.Emailid = this.vendorEmailList.toString();
        this.spinner.show();
        this.MprService.addNewVendor(this.newVendorDetails).subscribe(data => {
          this.spinner.hide();
          this.vendorSubmitted = false;
          this.vendorDetails.Vendorid = data;
          if (this.newVendorDetails.VendorName)
            this.vendorDetails.VendorName = this.newVendorDetails.VendorName;
          this.vendorDetails.UpdatedBy = this.employee.EmployeeNo;
          this.mprRevisionModel.MPRVendorDetails.push(this.vendorDetails);
          this.updateDocumentation(dialogName);
        })
      }
      //}
      //else {
      //  if (!this.vendorDetails.VendorName)
      //    return;
      //  else {
      //    this.vendorSubmitted = false;
      //    this.mprRevisionModel.MPRVendorDetails.push(this.vendorDetails);
      //    this.updateDocumentation(dialogName);
      //  }
      //}
    }
    else if (type == "documentDetails") {
      this.mprRevisionModel.MPRVendorDetails = [];
      this.mprRevisionModel.MPRDocumentations = [];
      this.MPR3Documents.push(this.mprDocuments);
      this.mprRevisionModel.MPRDocuments = this.MPR3Documents;
      this.updateDocumentation(dialogName);
    }
    else if (type == "documentations") {
      this.mprRevisionModel.MPRDocuments = [];
      this.mprRevisionModel.MPRVendorDetails = [];
      this.mprRevisionModel.MPRDocumentations.push(this.MPRDocumentations);
      this.updateDocumentation(dialogName);
    }

  }

  public updateDocumentation(dialogName: string) {
    this.spinner.show();
    this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
      this.spinner.hide();
      this.mprRevisionModel = data;
      this.MPR3Documents = this.mprRevisionModel.MPRDocuments.filter(li => li.DocumentTypeid == 2);
      this[dialogName] = false;
      this.MPRDocumentations = new MPRDocumentations();
      this.MPRDocumentations.DocumentationDescription = "";
    });
  }

  //Communication Block

  showCommunicationDialogToAdd(dialogName: string) {
    this[dialogName] = true;
    this.MPRCommunications = new MPRCommunication();
  }

  getComName(code: string) {
    if (code && this.searchItems.filter(li => li.code == code)[0])
      return this.searchItems.filter(li => li.code == code)[0].name
  }

  removeCommunication(details: MPRReminderTracking) {
    var index = this.MPRCommunications.MPRReminderTrackings.findIndex(x => x.MailTo == details.MailTo);
    this.MPRCommunications.MPRReminderTrackings.splice(index, 1);

  }
  removeAssignment(details: MPRAssignment) {
    var index = this.mprStatusUpdate.MPRAssignments.findIndex(x => x.Employeeno == details.Employeeno);
    this.mprStatusUpdate.MPRAssignments.splice(index, 1);
  }

  onCommnicationSubmit(dialogName: string) {
    this.mprRevisionModel.MPRItemInfoes = [];
    this.mprRevisionModel.MPRDocuments = [];
    this.mprRevisionModel.MPRDocumentations = [];
    this.mprRevisionModel.MPRVendorDetails = [];
    this.mprRevisionModel.MPRIncharges = [];
    this.MPRCommunicationSubmitted = true;
    if (this.MPRCommunications.SetReminder == false) {
      this.MPRCommunicationForm.controls['ReminderDate'].clearValidators();
      this.MPRCommunicationForm.controls['ReminderDate'].updateValueAndValidity();
    }
    else {
      this.MPRCommunicationForm.controls['ReminderDate'].setValidators([Validators.required]);
      this.MPRCommunicationForm.controls['sendemail'].clearValidators();
      this.MPRCommunicationForm.controls['sendemail'].updateValueAndValidity()
    }
    if (this.MPRCommunicationForm.invalid) {
      return;
    }
    else {
      this.mprRevisionModel.MPRItemInfoes = [];
      this.mprRevisionModel.MPRVendorDetails = [];
      this.mprRevisionModel.MPRDocumentations = [];
      this.mprRevisionModel.MPRIncharges = [];
      this.MPRCommunications.RemarksFrom = this.employee.EmployeeNo;
      this.MPRCommunications.RemarksDate = new Date();
      this.mprRevisionModel.MPRCommunications.push(this.MPRCommunications);
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
        this.mprRevisionModel = data;
        this[dialogName] = false;
      });
    }
  }

  getStatusList() {
    this.MprService.getStatusList().subscribe(data => {
      this.statusList = data;
    })
  }
  getRfqGeneratedList(revisionId: string) {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select RFQRevisions_N.rfqRevisionId, RFQRevisions_N.RevisionNo,RFQMaster.RFQNo,RFQMaster.VendorId,RFQStatus.StatusId from RFQMaster left join RFQRevisions_N on  RFQRevisions_N.rfqMasterId = RFQMaster.RfqMasterId left join RFQStatus on RFQStatus.RfqRevisionId=RFQRevisions_N.rfqRevisionId  where RFQMaster.MPRRevisionId = " + revisionId;
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.RfqGeneratedList = data;
    })
  }

  getCommunicationList() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from RFQCommunications";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.rfqCommunicationList = data;
    })
  }
  getPAdetails(revisionId: string) {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select distinct PAID, VendorName, RFQNo,PAStatus,PAStatusUpdate, POStatus,POStatusUpdate from LoadItemsByPAID where MPRRevisionId = " + revisionId;
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.PAdetailsList = data;
    })
  }

  onstatusUpdate(statusType: string) {
    if (statusType != "") {
      if (statusType == "MPRManualStatus" && (!this.mprStatusUpdate.StatusId || !this.mprStatusUpdate.Remarks)) {
          if (!this.mprStatusUpdate.StatusId)
          this.messageService.add({ severity: 'error', summary: 'Validation', detail: "Select Status" });
        if (!this.mprStatusUpdate.Remarks)
          this.messageService.add({ severity: 'error', summary: 'Validation', detail: "Enter Remarks" });
        return true;

      }
      this.mprStatusUpdate.typeOfuser = statusType;
      if (this.mprStatusUpdate.BuyerGroupId)
        this.mprStatusUpdate.MPRAssignments = [];
    }
    else {
      if (this.mprRevisionModel.CheckedBy == this.employee.EmployeeNo && this.mprRevisionModel.CheckStatus != 'Approved')
        this.mprStatusUpdate.typeOfuser = "Checker";
      else if (this.mprRevisionModel.ApprovedBy == this.employee.EmployeeNo && this.mprRevisionModel.ApprovalStatus != 'Approved')
        this.mprStatusUpdate.typeOfuser = "Approver";
      else if (this.mprRevisionModel.SecondApprover == this.employee.EmployeeNo && this.mprRevisionModel.SecondApproversStatus != 'Approved')
        this.mprStatusUpdate.typeOfuser = "SecondApprover";
      else if (this.mprRevisionModel.ThirdApprover == this.employee.EmployeeNo && this.mprRevisionModel.ThirdApproverStatus != 'Approved')
        this.mprStatusUpdate.typeOfuser = "ThirdApproverThirdApprover";

      else if (this.mprRevisionModel.OCheckedBy == this.employee.EmployeeNo && this.mprRevisionModel.OCheckStatus != 'Approved')
        this.mprStatusUpdate.typeOfuser = "OChecker";
      else if (this.mprRevisionModel.OApprovedBy == this.employee.EmployeeNo && this.mprRevisionModel.OApprovalStatus != 'Approved')
        this.mprStatusUpdate.typeOfuser = "OApprover";
      else if (this.mprRevisionModel.OSecondApprover == this.employee.EmployeeNo && this.mprRevisionModel.OSecondApproversStatus != 'Approved')
        this.mprStatusUpdate.typeOfuser = "OSecondApprover";
      else if (this.mprRevisionModel.OThirdApprover == this.employee.EmployeeNo && this.mprRevisionModel.OThirdApproverStatus != 'Approved')
        this.mprStatusUpdate.typeOfuser = "OThirdApproverThirdApprover";

    }
    this.mprStatusUpdate.RevisionId = this.mprRevisionModel.RevisionId;
    this.mprStatusUpdate.RequisitionId = this.mprRevisionModel.RequisitionId;
    this.mprStatusUpdate.PreparedBy = this.employee.EmployeeNo;
    this.spinner.show();
    this.MprService.statusUpdate(this.mprStatusUpdate).subscribe(data => {
      this.spinner.hide();
      this.mprRevisionModel = data;
      if (statusType == "MPRManualStatus")
        this.showManualStatusgDialog = false;
      if (statusType == "")
        this.disableStatusSubmit = true;
      else {
        this.showAcknowledge = false;
        this.showRfqGen = true;
        this.showCompareRfq = true;
      }

      this.loadMPRData(this.mprRevisionModel.RevisionId);
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Status Updated' });
    })

  }

  fileChange(event: any, formName: string) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      var revisionId = this.mprRevisionModel.RevisionId.toString();
      formData.append(revisionId, file, file.name);
      this.spinner.show();
      this.MprService.uploadFile(formData).subscribe(data => {
        this.spinner.hide();
        if (data.Message) {
          this.messageService.add({ severity: 'error', summary: 'Validation', detail: data.Message });
          return true;
        }
        //upload in cloud server
        this.MprService.InsertDocument(formData).subscribe(data => {
        });
        (<HTMLInputElement>document.getElementById("uploadInputFile")).value = "";
        this.mprDocuments = new MPRDocument();
        this.mprDocuments.Path = data;
        this.mprDocuments.DocumentName = file.name;
        if (formName == "supportingDocument") {
          this.mprDocuments.ItemDetailsId = null;
          this.mprDocuments.DocumentTypeid = 2;
          //this.MPR3Documents.push(this.mprDocuments);
        }
        else {
          this.mprDocuments.DocumentTypeid = 1;
          this.mprDocuments.ItemDetailsId = this.itemDetails.Itemdetailsid;
        }
        this.mprRevisionModel.MPRDocuments.push(this.mprDocuments);
      });
    }
  }
  uploadExcel(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      var revisionId = this.mprRevisionModel.RevisionId.toString();
      formData.append(revisionId, file, file.name);
      this.spinner.show();
      this.MprService.uploadExcel(formData).subscribe(data => {
        this.spinner.hide();
        if (data) {
          this.mprDocuments = new MPRDocument();
          this.mprDocuments.Path = data;
          this.mprDocuments.DocumentName = file.name;
          this.mprDocuments.DocumentTypeid = 3;
          this.mprDocuments.ItemDetailsId = null;
          this.mprRevisionModel.MPRDocuments.push(this.mprDocuments);
          this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
            this.mprRevisionModel = data;
            this.displayItemDialog = false;
          });
          this.messageService.add({ severity: 'sucess', summary: 'Sucess Message', detail: 'file uploaded' });
        }
      });
    }
  }

  loadMPRData(revisionId: any) {
    this.MprService.getMPRRevisionDetails(revisionId).subscribe(data => {
      this.mprRevisionModel = data;
      if (this.mprRevisionModel && this.mprRevisionModel.DeleteFlag == false) {
        if (this.mprRevisionModel.DeliveryRequiredBy)
          this.mprRevisionModel.DeliveryRequiredBy = new Date(this.mprRevisionModel.DeliveryRequiredBy);
        else
          this.mprRevisionModel.DeliveryRequiredBy = new Date();
        this.MPR3Documents = this.mprRevisionModel.MPRDocuments.filter(li => li.DocumentTypeid == 2);
        this.MprService.getMprRevisionList(this.mprRevisionModel.RequisitionId).subscribe(data => {
          this.mprRevisionList = data;
          this.mprRevisionDetails = this.mprRevisionList.filter(li => li.RevisionId == this.mprRevisionModel.RevisionId)[0];
          if (this.mprRevisionDetails && this.mprRevisionDetails.MPRStatusTrackDetails && this.mprRevisionDetails.StatusId)
            this.currentStatus = this.mprRevisionDetails.MPRStatusTrackDetails.filter(li => li.StatusId == this.mprRevisionDetails.StatusId)[0].Status;
          this.bindMPRPageForm("MPRPageForm1", this.mprRevisionDetails);
          this.bindMPRPageForm("MPRItemDetailsForm", this.mprRevisionDetails);
          this.bindMPRPageForm("MPRPageForm2", this.mprRevisionDetails);
          this.bindMPRPageForm("MPRInchargeForm", this.mprRevisionDetails);
          this.bindMPRPageForm("MPRPageForm3", this.mprRevisionDetails);
          this.form1Edit = this.materialFormEdit = this.vendorFormEdit = this.form3Edit = true;
          this.showMaterialForm = this.showVendorForm = this.showOtherDetailsForm = true;
          if (this.mprRevisionDetails.CheckedBy.trim() == "-") {
            this.showForm1EditBtn = this.showMaterialEditBtn = this.showVendorEditBtn = this.shoForm3EditBtn = this.showCommEditBtn = this.showCommunicationForm = false;
          }
          else {
            this.showForm1EditBtn = this.showMaterialEditBtn = this.showVendorEditBtn = this.shoForm3EditBtn = this.showCommEditBtn = this.showCommunicationForm = true;
          }

          //Access based functionalities
          if (this.AccessList.filter(li => li.AccessName == "MPRPAView").length > 0)
            this.showPALink = true;
          if (this.AccessList.filter(li => li.AccessName == "DeleteDcoument").length > 0)
            this.deleteDocument = true;
          if (this.AccessList.filter(li => li.AccessName == "ViewRFQ").length > 0)
            this.viewRfq = true;
          if (this.AccessList.filter(li => li.AccessName == "ViewRFQ").length > 0 && this.viewRfq == true)
            this.editRfq = true;
          if (this.AccessList.filter(li => li.AccessName == "EditMPR").length > 0)
            this.showForm1EditBtn = this.showMaterialEditBtn = this.showVendorEditBtn = this.shoForm3EditBtn = this.showCommEditBtn = false;
          if (this.AccessList.filter(li => li.AccessName == "DeleteMPR").length > 0)
            this.hideDeleteBtn = true;

          //if mpr close hiding the edit buttons
          if (this.mprRevisionDetails.StatusId == 19)
            this.showForm1EditBtn = this.showMaterialEditBtn = this.showVendorEditBtn = this.shoForm3EditBtn = this.showCommEditBtn = this.showCommunicationForm = true;

          this.bindStatusDetails();
          this.showPage = true;
          this.spinner.hide();
        });
      }
      else {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No data for this revision' });
      }

    });
  }
  //bind Status Details
  bindStatusDetails() {

    if ((this.mprRevisionModel.CheckedBy == this.employee.EmployeeNo) && this.mprRevisionModel.CheckStatus == "Pending" || this.mprRevisionModel.CheckStatus == "Submitted" || this.mprRevisionModel.CheckStatus == "Sent for Modification") {
      this.mprStatusUpdate.status = this.mprRevisionModel.CheckStatus;
      this.mprStatusUpdate.Remarks = this.mprRevisionModel.CheckerRemarks;
      this.showStatusDetails = true;
    }
    else if ((this.mprRevisionModel.ApprovedBy == this.employee.EmployeeNo && this.mprRevisionModel.CheckStatus == "Approved") && this.mprRevisionModel.ApprovalStatus == "Pending" || this.mprRevisionModel.ApprovalStatus == "Submitted" || this.mprRevisionModel.ApprovalStatus == "Sent for Modification") {
      this.mprStatusUpdate.status = this.mprRevisionModel.ApprovalStatus;
      this.mprStatusUpdate.Remarks = this.mprRevisionModel.ApproverRemarks;
      this.showStatusDetails = true;
    }
    else if ((this.mprRevisionModel.SecondApprover == this.employee.EmployeeNo && this.mprRevisionModel.ApprovalStatus == "Approved") && this.mprRevisionModel.SecondApproversStatus == "Pending" || this.mprRevisionModel.SecondApproversStatus == "Submitted" || this.mprRevisionModel.SecondApproversStatus == "Sent for Modification") {
      this.mprStatusUpdate.status = this.mprRevisionModel.SecondApproversStatus;
      this.mprStatusUpdate.Remarks = this.mprRevisionModel.SecondApproverRemarks;
      this.showStatusDetails = true;
    }
    else if ((this.mprRevisionModel.ThirdApprover == this.employee.EmployeeNo && this.mprRevisionModel.SecondApproversStatus == "Approved") && this.mprRevisionModel.ThirdApproverStatus == "Pending" || this.mprRevisionModel.ThirdApproverStatus == "Submitted" || this.mprRevisionModel.ThirdApproverStatus == "Sent for Modification") {
      this.mprStatusUpdate.status = this.mprRevisionModel.ThirdApproverStatus;
      this.mprStatusUpdate.Remarks = this.mprRevisionModel.ThirdApproverRemarks;
      this.showStatusDetails = true;
    }
    else
      this.showStatusDetails = false;
    //acknowledged or not
    this.showAcknowledge = false;
    if ((this.mprRevisionDetails.MPRStatusTrackDetails.filter(li => li.Status == "Acknowledged").length <= 0) && (this.AccessList.filter(li => li.AccessName == "Acknowledged").length > 0) && (this.mprRevisionModel.CheckStatus == "Approved" && this.mprRevisionModel.ApprovalStatus == "Approved") && (this.mprRevisionModel.SecondApprover == "-" || this.mprRevisionModel.SecondApprover == null)) {
      this.showAcknowledge = true;
    }
    else {
      if ((this.mprRevisionDetails.MPRStatusTrackDetails.filter(li => li.Status == "Acknowledged").length <= 0) && (this.AccessList.filter(li => li.AccessName == "Acknowledged").length > 0) && (this.employee.OrgDepartmentId == 14 && (this.mprRevisionModel.SecondApproversStatus == "Approved") && this.mprRevisionModel.ThirdApprover == null))
        this.showAcknowledge = true;
      else {
        if ((this.mprRevisionDetails.MPRStatusTrackDetails.filter(li => li.Status == "Acknowledged").length <= 0) && (this.AccessList.filter(li => li.AccessName == "Acknowledged").length > 0) && (this.employee.OrgDepartmentId == 14 && this.mprRevisionModel.ThirdApprover != null && this.mprRevisionModel.ThirdApproverStatus == "Approved"))
          this.showAcknowledge = true;
        else
          this.showAcknowledge = false;
      }
    }

    //show PO raise icon based status and active rvision
    if (this.mprRevisionModel.IssuePurposeId == 1 && this.mprRevisionModel.CheckStatus == "Approved" && this.mprRevisionModel.ApprovalStatus == "Approved" && !this.mprRevisionModel.SecondApprover && !this.mprRevisionModel.ThirdApprover) {
      this.showraisePo = true;
      if (this.mprRevisionModel.SecondApprover && this.mprRevisionModel.SecondApproversStatus != "Approved" && this.mprRevisionModel.ThirdApprover && this.mprRevisionModel.ThirdApproverStatus != "Approved")
        this.showraisePo = false;

    }
    //for PO raising details
    if ((this.mprRevisionModel.OCheckedBy == this.employee.EmployeeNo) && this.mprRevisionModel.OCheckStatus == "Pending" || this.mprRevisionModel.OCheckStatus == "Submitted" || this.mprRevisionModel.OCheckStatus == "Sent for Modification") {
      this.mprStatusUpdate.status = this.mprRevisionModel.OCheckStatus;
      this.mprStatusUpdate.Remarks = this.mprRevisionModel.OCheckStatus;
      this.showStatusDetails = true;
    }
    else if ((this.mprRevisionModel.OApprovedBy == this.employee.EmployeeNo && this.mprRevisionModel.OCheckStatus == "Approved") && this.mprRevisionModel.OApprovalStatus == "Pending" || this.mprRevisionModel.OApprovalStatus == "Submitted" || this.mprRevisionModel.OApprovalStatus == "Sent for Modification") {
      this.mprStatusUpdate.status = this.mprRevisionModel.OApprovalStatus;
      this.mprStatusUpdate.Remarks = this.mprRevisionModel.OApproverRemarks;
      this.showStatusDetails = true;
    }
    else if ((this.mprRevisionModel.OSecondApprover == this.employee.EmployeeNo && this.mprRevisionModel.OApprovalStatus == "Approved") && this.mprRevisionModel.OSecondApproversStatus == "Pending" || this.mprRevisionModel.OSecondApproversStatus == "Submitted" || this.mprRevisionModel.OSecondApproversStatus == "Sent for Modification") {
      this.mprStatusUpdate.status = this.mprRevisionModel.OSecondApproversStatus;
      this.mprStatusUpdate.Remarks = this.mprRevisionModel.OSecondApproverRemarks;
      this.showStatusDetails = true;
    }
    else if ((this.mprRevisionModel.OThirdApprover == this.employee.EmployeeNo && this.mprRevisionModel.OSecondApproversStatus == "Approved") && this.mprRevisionModel.OThirdApproverStatus == "Pending" || this.mprRevisionModel.OThirdApproverStatus == "Submitted" || this.mprRevisionModel.OThirdApproverStatus == "Sent for Modification") {
      this.mprStatusUpdate.status = this.mprRevisionModel.OThirdApproverStatus;
      this.mprStatusUpdate.Remarks = this.mprRevisionModel.OThirdApproverRemarks;
      this.showStatusDetails = true;
    }
    else {
      if (this.mprRevisionModel.OThirdApprover)
        this.showStatusDetails = false;
    }

    //PO released or not to enable repeat order
    if (this.mprRevisionDetails.MPRStatusTrackDetails.filter(li => li.Status == "PO Released").length > 0)
      this.RepeatOrder = true;
    else
      this.RepeatOrder = false;

    if (this.showStatusDetails || this.showAcknowledge)
      this.displayFooter = true;
    else
      this.displayFooter = false;
    if (this.AccessList.length > 0) {
      if (this.AccessList.filter(li => li.AccessName == "GenerateRFQ").length > 0 && this.employee.OrgDepartmentId == 14)//for CMM
        this.showRfqGen = true;
      if (this.AccessList.filter(li => li.AccessName == "CompareRFQ").length > 0 && this.employee.OrgDepartmentId == 14)
        this.showCompareRfq = true;
      if (this.AccessList.filter(li => li.AccessName == "AddManualStatus").length > 0 && this.employee.OrgDepartmentId == 14)
        this.showManualStatus = true;

    }
    if (this.mprRevisionDetails.MPRStatusTrackDetails.filter(li => li.Status == "Acknowledged").length > 0 && this.employee.OrgDepartmentId == 14)
      this.showRfqGen = this.showCompareRfq = true;
    else
      this.showRfqGen = this.showCompareRfq = false;

  }

  bindMPRPageForm(formName: string, data: any) {
    for (let item in this[formName].controls) {
      if ((this.constants[item]) && (data[this.constants[item].fieldAliasName])) {
        (data[this.constants[item].fieldAliasName] == '-' ? this[formName].controls[item].setValue("") : this[formName].controls[item].setValue(data[this.constants[item].fieldAliasName]));
        //this[formName].controls[item].setValue(data[this.constants[item].fieldAliasName])
      }
      else {
        (data[item] == '-' ? this[formName].controls[item].setValue("") : this[formName].controls[item].setValue(data[item]));
        //this[formName].controls[item].setValue(data[item]);
        if (item == "DeliveryRequiredBy") {
          (data[item] != null ? this[formName].controls[item].setValue(new Date(data[item])) : this[formName].controls[item].setValue(new Date()))
        }
        if (item == "JustificationForSinglePreferredVendor") {
          if (data[item])
            this.justificationDisply = false;
          else
            this.justificationDisply = true;
        }

      }
      if (item == "DispatchLocation") {
        this.specifyDispatchDisply = true;
        if (data[item] == "EC / Factory" || data[item] == "EC - Products" || data[item] == "Phase-II")
          this.DispatchLocation = "";
        else {
          this.specifyDispatchDisply = false;
          this.DispatchLocation = data[item];
          this[formName].controls[item].setValue("Others");
        }
        if (this.specifyDispatchDisply == false) {
          this.mprRevisionModel.DispatchLocation = this.DispatchLocation;
          this[formName].controls['specifyDispatchLocation'].setValue(data[item]);
        }
        else
          this.MPRPageForm3.controls['specifyDispatchLocation'].clearValidators();
      }

      //if (this.constants[item]) {
      //  this.bindSearchListData("", formName, item, "", (): any => {
      //    this.showList = false;
      //    if (this.searchItems.filter(li => li.code == data[item]).length > 0)
      //      this[formName].controls[item].setValue(this.searchItems.filter(li => li.code == data[item])[0].name);
      //    else {
      //      if (item == "DispatchLocation") {
      //        this.specifyDispatchDisply = false;
      //        this.MPRPageForm3.controls['specifyDispatchLocation'].setValue(data[item]);
      //        this[formName].controls[item].setValue("Others");
      //      }
      //    }
      //  });
      //}
      //}
    }
  }

  public animateCSS(formId, animatepostion) {
    const element = document.getElementById(formId);
    element.classList.add('animated', animatepostion);
    element.addEventListener('animationend', function () {
      element.classList.remove('animated', animatepostion);
    })
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

  getEmployeename(empNo: number) {
    if (this.EmployeeList.filter(li => li.EmployeeNo == empNo).length > 0)
      return this.EmployeeList.filter(li => li.EmployeeNo == empNo)[0].Name;
  }
  viewDocument(path: string, documentname: string) {
    //this.doc = this.sanitizer.bypassSecurityTrustResourceUrl("http://10.29.15.68:90/SCMDocs/2.xlsx");
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.Documnentpath + path1;
    window.open(path1);
    //window.open("http://10.29.15.68:90/SCMDocs/2.xlsx");
    //this.showFileViewer = true;    
  }

  scrollToView(id, navId) {
    var elmnt = document.getElementById(id);
    elmnt.scrollIntoView(false);
    //var navelmnt = document.getElementById(navId);
    // navelmnt.classList.add("active");
  }
  //Binding selected units
  public BindUnits(unitId: number) {
    if (unitId == 1)
      return "Nos"
    if (unitId == 2)
      return "Set"
    if (unitId == 3)
      return "Kgs"
    else
      return "";

  }
  //Adding new vendor
  public addNewVendor() {
    this.showNewVendor = true;
  }
  //bind rfq link in vendor details
  getRfqData(vendorId: string, type: string, rfqRevisionId: any) {
    if (this.RfqGeneratedList.length > 0) {
      var res = this.RfqGeneratedList.filter(li => li.VendorId == vendorId && li.rfqRevisionId == rfqRevisionId)[0];
      if (res) {
        if (type == "rfqLink")
          return res.RFQNo + "-" + res.RevisionNo;
        else
          return res.rfqRevisionId;
      }
      else
        return "";
    }
  }

  //get rfq status details
  getRfqStatus(vendorId: string, rfqRevisionId: any) {
    if (this.RfqGeneratedList.length > 0) {
      var res = this.RfqGeneratedList.filter(li => li.VendorId == vendorId && li.rfqRevisionId == rfqRevisionId)[0];
      if (res && res.StatusId) {
        return res.StatusId;
      }
      else
        return "";
    }
  }

  //rfq raised
  checkrfqRaised(rfqRevisionId: any) {
    if (this.rfqCommunicationList.length > 0)
      var res = this.rfqCommunicationList.filter(li => li.rfqRevisionId == rfqRevisionId)[0];
    if (res)
      return true;
    else
      return false;
  }
  showVendorClick() {
    this.newVendorDetails.Vendorid = 0;
    this.newVendor.controls['VendorName'].setValidators([Validators.required]);
    this.newVendor.controls['ContactNo'].setValidators([Validators.required]);
    this.newVendor.controls['VendorName'].updateValueAndValidity();
    this.newVendor.controls['ContactNo'].updateValueAndValidity();
  }
  downLoadExcelFormat() {

    var path = this.constants.Documnentpath + "MPRItemListFormat.xlsx";
    window.open(path);
  }
  selectMprLineItems(event: any, index: number, details: MPRItemInfoes) {
    var ind = this.RepeatOrderList.findIndex(x => x.Itemdetailsid == details.Itemdetailsid);
    if (ind > -1)
      this.RepeatOrderList.splice(ind, 1);
    details.RepeatOrderRefId = details.Itemdetailsid;
    if (event.target.checked)
      this.RepeatOrderList.push(details);

  }
  onRevisionCopy() {
    if (this.RepeatOrderList.length > 0) {
      this.mprRevisionModel.PreparedBy = this.employee.EmployeeNo;
      this.mprRevisionModel.MPRItemInfoes = this.RepeatOrderList;
      this.mprRevisionModel.PurchaseTypeId = 5;
      this.spinner.show();
      this.MprService.copyMprRevision(this.mprRevisionModel, true, false).subscribe(data => {
        this.spinner.hide();
        if (data) {
          this.messageService.add({ severity: 'sucess', summary: 'Sucess Message', detail: 'Order Added' });
        }
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select atleast one line item. ' });
    }
  }
  showPORaiseDialog() {
    this.showPOordingDialog = true;
    if (!this.mprRevisionModel.OCheckedBy)
      this.mprRevisionModel.OCheckedBy = this.mprRevisionModel.CheckedBy;
    if (!this.mprRevisionModel.OApprovedBy)
      this.mprRevisionModel.OApprovedBy = this.mprRevisionModel.ApprovedBy;
    this.bindSearchListData('', '', 'OCheckedBy', "", (): any => {
      this.showList = false;
      this.POraiseForm.controls['OCheckedBy'].setValue(this.searchItems.filter(li => li.listName == "OCheckedBy" && li.code == this.mprRevisionModel.OCheckedBy)[0].name);
      this.POraiseForm.value.OCheckedBy = this.mprRevisionModel.OCheckedBy;
      this.POraiseForm.controls['OCheckedBy'].updateValueAndValidity()
    });
    this.bindSearchListData('', '', 'OApprovedBy', "", (): any => {
      this.showList = false;
      this.POraiseForm.controls["OApprovedBy"].setValue(this.searchItems.filter(li => li.listName == "OApprovedBy" && li.code == this.mprRevisionModel.OApprovedBy)[0].name);
      this.POraiseForm.value.OApprovedBy = this.mprRevisionModel.OApprovedBy;
      this.POraiseForm.controls['OApprovedBy'].updateValueAndValidity()
    });
    if (this.mprRevisionModel.OSecondApprover) {
      this.bindSearchListData('', '', 'OSecondApprover', "", (): any => {
        this.showList = false;
        this.POraiseForm.controls['OSecondApprover'].setValue(this.searchItems.filter(li => li.listName == "OSecondApprover" && li.code == this.mprRevisionModel.OSecondApprover)[0].name);
        this.POraiseForm.value.OSecondApprover = this.mprRevisionModel.OSecondApprover;
        this.POraiseForm.controls['OSecondApprover'].updateValueAndValidity()
      });
    }

    if (this.mprRevisionModel.OThirdApprover) {
      this.bindSearchListData('', '', 'OThirdApprover', "", (): any => {
        this.showList = false;
        this.POraiseForm.controls["OThirdApprover"].setValue(this.searchItems.filter(li => li.listName == "OThirdApprover" && li.code == this.mprRevisionModel.OThirdApprover)[0].name);
        this.POraiseForm.value.OApprovedBy = this.mprRevisionModel.OThirdApprover;
        this.POraiseForm.controls['OThirdApprover'].updateValueAndValidity()
      });
    }
  }
  onPoRaiseSubmit(dialog: any) {
    this.mprRevisionModel.ORequestedBy = this.employee.EmployeeNo;
    this.spinner.show();
    this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
      this.spinner.hide();
      this.mprRevisionModel = data;
      this[dialog] = false;
      this.messageService.add({ severity: 'sucess', summary: 'Sucess Message', detail: 'Request for issuing po addedd' });
    });
  }

  showManualStatusDialog() {
    this.showManualStatusgDialog = true;
  }

  addEmail() {
    if (this.newVendorDetails.Emailid) {
      var index = this.vendorEmailList.indexOf(this.newVendorDetails.Emailid);
      if (index > -1) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Vendor Email already addedd' });
      }
      else {
        if (this.ValidateEmail())
          this.vendorEmailList.push(this.newVendorDetails.Emailid);
      }
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Email id' });
    }
    //this.newVendorDetails.Emailid = "";
  }

  removeVendorEmail(email: string) {
    var index = this.vendorEmailList.indexOf(email);
    if (index > -1)
      this.vendorEmailList.splice(index, 1);
  }
  getPOnumbers(details: any) {

    if (details && details.PAItems) {
      var result = details.PAItems.map(a => a.PONO);
      return result.toString();
    }

  }

  //Purpose : <<SCM Open issues coding start from here>>
  //enable buyergropu change footer
  enableBuyerGrp() {
    this.displayFooter = true;
    this.showAcknowledge = true;
  }

  disableFooter() {
    this.displayFooter = false;
  }
  enableVendorAdd(dialogName: string) {
    if (this.employee.OrgDepartmentId == 14) {
      if (this.MPRPageForm2.controls.PurchaseTypeId.value == "Single Vendor" && this.mprRevisionModel.MPRVendorDetails.length == 1)//single vendor
      {
        this[dialogName] = false;
        this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Access to add one vendor only' });
      }
      else
        this[dialogName] = true;
    }
    else {
      if ((this.MPRPageForm2.controls.PurchaseTypeId.value == "Single Vendor" && this.mprRevisionModel.MPRVendorDetails.length == 1)) {
        this[dialogName] = false;
        this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Access to add one vendor only' });
      }
      else if (this.MPRPageForm2.controls.PurchaseTypeId.value != "Single Vendor") {
        this[dialogName] = false;
        this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'No Access to add  vendor' });
      }
      else {
        this[dialogName] = true;
      }
    }
  }

  //function to validate email
  ValidateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.newVendorDetails.Emailid)) {
      return true;
    }
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'You have entered an invalid email address!' });
    return false;
  }

  editRFQData(rfqrevisionId: any) {
    // this.router.navigate(['/SCM/RFQForm', rfqrevisionId]);
    this.router.navigate([]).then(result => {
      window.open('/SCM/RFQForm/' + rfqrevisionId + '', '_blank');
    });
  }

  //<<SCM Open issues coding Ended>>
}



