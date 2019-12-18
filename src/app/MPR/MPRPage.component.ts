import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Employee,DynamicSearchResult, searchList, mprRevision, MPRItemInfoes, MPRDetail, MPRDocument, MPRVendorDetail, MPRDocumentations, MPRIncharge, MPRCommunication, MPRReminderTracking, MPRStatusUpdate } from '../Models/mpr';
import { MprService } from '../services/mpr.service';
import { constants } from '../Models/MPRConstants'
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-MPRPage',
  templateUrl: './MPRPage.component.html'
})
export class MPRPageComponent implements OnInit {
  constructor(private router: Router,private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public constants: constants, private route: ActivatedRoute, private messageService: MessageService, private spinner: NgxSpinnerService) { }
  @ViewChild('dialog', { read: ElementRef, static: true })
  protected dialogElement: ElementRef;

  //variable Declarations start
  public employee: Employee;
  public MPRPageForm1; MPRItemDetailsForm; MPRPageForm2; MPRInchargeForm; MPRPageForm3; MPRCommunicationForm: FormGroup;
  public showMaterialForm; showVendorForm; showOtherDetailsForm; communicationFormEdit; showCommunicationForm: boolean = false;
  public form1Edit; materialFormEdit; vendorFormEdit; form3Edit; showForm1EditBtn; showMaterialEditBtn; showVendorEditBtn; shoForm3EditBtn; showCommEditBtn: boolean = false;
  public MPRForm1Submitted; MPRItemDetailsSubmitted; vendorSubmitted; MPRForm2Submitted; MPRForm3Submitted; MPRCommunicationSubmitted = false;
  public displayInchargeDialog; showVendorDialog; showDocumentationDialog; displayCommunicationDialog: boolean = false;
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
  public formName: string;
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
  public MPRReminderTrackings: MPRReminderTracking;
  public EmployeeList: Array<any> = [];
  public mprStatusUpdate: MPRStatusUpdate;
  public statusList: Array<any> = [];
  public displayFooter: boolean;
  public disableStatusSubmit: boolean = false;
  public showPage: boolean = false;

  //page load event
  ngOnInit() {
    //if (localStorage.getItem("Employee")) {
    //  this.employee = JSON.parse(localStorage.getItem("Employee"))[0];
    //}
    //else {
    //  this.router.navigateByUrl("Login");
    //}
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

    //create static drop down text from 1 to 100
    Array(100).fill(1).map((x, i) => {
      this.numbers.push(i + 1);
    });

    //form 1 validation declararion.
    this.MPRPageForm1 = this.formBuilder.group({
      docNo: ['', [Validators.required]],
      DocumentDescription: ['', [Validators.required]],
      IssuePurposeId: ['', [Validators.required]],
      DepartmentId: ['', [Validators.required]],
      ProjectManager: ['', [Validators.required]],
      JobCode: ['', [Validators.required]],
      JobName: ['', [Validators.required]],
      GEPSApprovalId: ['', [Validators.required]],
      SaleOrderNo: ['', [Validators.required]],
      ClientName: ['', [Validators.required]],
      PlantLocation: ['', [Validators.required]],
      BuyerGroupId: ['', [Validators.required]],
    });

    //MPRItemDetailsForm validation declararion.
    this.MPRItemDetailsForm = this.formBuilder.group({
      ItemId: ['', [Validators.required]],
      ItemDescription: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      UnitId: ['', [Validators.required]],
      SOLineItemNo: ['', [Validators.required]],
      // SaleOrderNo: ['', [Validators.required]], 
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
      NoOfSetsOfQAP: ['', [Validators.required]],
      InspectionRequired: ['', [Validators.required]],
      InspectionComments: ['', [Validators.required]],
      NoOfSetsOfTestCertificates: ['', [Validators.required]],
      ProcurementSourceId: ['', [Validators.required]],
      CustomsDutyId: ['', [Validators.required]],
      ProjectDutyApplicableId: ['', [Validators.required]],
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
    //remove validation for unwanted fields.
    this.MPRPageForm1.controls['docNo'].clearValidators();
    this.MPRPageForm1.controls['JobCode'].clearValidators();
    this.MPRPageForm1.controls['JobName'].clearValidators();
    this.MPRPageForm1.controls['GEPSApprovalId'].clearValidators();
    this.MPRItemDetailsForm.controls['SOLineItemNo'].clearValidators();
    this.MPRItemDetailsForm.controls['ReferenceDocNo'].clearValidators();
    this.MPRItemDetailsForm.controls['TargetSpend'].clearValidators();
    this.MPRPageForm1.controls['SaleOrderNo'].clearValidators();
    this.MPRPageForm1.controls['PlantLocation'].clearValidators();
    this.MPRPageForm2.controls['TargetSpend'].clearValidators();
    this.MPRPageForm2.controls["TargetedSpendRemarks"].clearValidators();
    this.MPRPageForm3.controls['GuaranteePeriod'].clearValidators();
    this.MPRPageForm3.controls['InspectionComments'].clearAsyncValidators();
    this.MPRPageForm3.controls['supplyMonths'].clearValidators();
    this.MPRPageForm3.controls['commissionMonths'].clearValidators();
    this.MPRPageForm3.controls['TrainingRemarks'].clearValidators();
    this.MPRPageForm3.controls['Remarks'].clearValidators();

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
      if (params["MPRRevisionId"]) {
        var revisionId = params["MPRRevisionId"];
        this.spinner.show();
        this.loadMPRData(revisionId);
      }
      else {
        this.showPage = true;
      }
    });
    this.getStatusList();
  }


  //on search list dialog show event
  onSearhListDialogShow() {
    setTimeout(() => {
      //this.dialogElement.nativeElement.children[0].style.top = this.dialogTop;
    }, 10);
  }

  //Binding searchList data
  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.formName = formName;
    this.dialogTop = e.clientY + 30 + "px";
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    this.MprService.GetListItems(this.dynamicData).subscribe(data => {
      if (data.length == 0)
        this.showList = false;
      else
        this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {
        if (name == 'ClientName')
          fName = item[this.constants[name].fieldName] + " - " + item["YGSSAPCustomerCode"];
        else if (name == "venderid")
          fName = item[this.constants[name].fieldName] + " - " + item["VendorCode"];
        else
          fName = item[this.constants[name].fieldName];
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId] };
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
    if (item.listName == "ItemId")
      this.itemDetails[this.txtName] = item.code;
    if (item.listName == "venderid") {
      if (this.mprRevisionModel.MPRVendorDetails.filter(li => li.Vendorid == item.code).length > 0) {
        alert("vendor already exist");
        return false;
      }
      this.vendorDetails.Vendorid = item.code;
      this.vendorDetails.VendorName = item.name
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
        this.MPRPageForm2.controls['JustificationForSinglePreferredVendor'].clearValidators();

      }
      this.MPRPageForm2.controls['JustificationForSinglePreferredVendor'].updateValueAndValidity()
    }

    if (this.formName == "MPRPageForm3" && item.listName == "DispatchLocation") {
      this.MPRPageForm3.controls['specifyDispatchLocation'].setValue("");
      if (item.code == 3) {
        this.specifyDispatchDisply = false;
        this.MPRPageForm3.controls['specifyDispatchLocation'].setValidators([Validators.required]);
      }
      else {
        this.specifyDispatchDisply = true;
        //this.MPRPageForm3.controls['specifyDispatchLocation'].setValue("");
        this.MPRPageForm3.controls['specifyDispatchLocation'].clearValidators();

      }

      this.MPRPageForm3.controls['specifyDispatchLocation'].updateValueAndValidity()
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
  }

  //form1 code started

  onMPRForm1Submit(formId, showform, formEdit: string) {
    this.MPRForm1Submitted = true;
    if (this.MPRPageForm1.invalid) {
      return;
    }
    else {
      this.mprRevisionModel.PreparedBy = this.employee.EmployeeNo;
      this.mprRevisionModel.PreparedOn = new Date();
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
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
    var index = this.selectedlist.findIndex(x => x.listName == 'ItemId');
    if (index > -1)
      this.selectedlist.splice(index, 1);
    this.selectedItem = new searchList();
    this[dialog] = true;
  }

  showInchargeDialogToAdd(dialog: string) {
    this.mprIncharges = new MPRIncharge();
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

  onRowEditInit(e: any, formName: string, details: MPRItemInfoes, name: string) {
    this.itemDetails = details;
    this.displayItemDialog = true;
    this.bindSearchListData(e, formName, 'ItemId', "", (): any => {
      this.showList = false;
      this.MPRItemDetailsForm.controls.ItemId.value = this.searchItems.filter(li => li.listName == name && li.code == details.Itemid)[0].name;
      this.MPRItemDetailsForm.value.ItemId = details.Itemid;
    });

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
      this.MprService.deleteMPRDocument(details).subscribe(data => {
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
    this.vendorDetails.Vendorid = vendorDetails.Vendorid;
    this.vendorDetails.VendorName = vendorDetails.VendorMaster.VendorName;
    this[dialogName] = true;
  }

  removeVendor(details: MPRVendorDetail) {
    var index = this.mprRevisionModel.MPRVendorDetails.findIndex(x => x.VendorDetailsId == details.VendorDetailsId);
    if (details.VendorDetailsId) {
      this.MprService.deleteMPRVendor(details).subscribe(data => {
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
      document.getElementById("MPRPageForm3").scrollIntoView(false);
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
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
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
      this.MprService.deleteDocumentation(details).subscribe(data => {
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

  guranteeChanges() {
    if (this.mprRevisionModel.GuaranteePeriod[0] == "Not Applicable") {
      this.MPRPageForm3.controls["supplyMonths"].setValue("");
      this.MPRPageForm3.controls["commissionMonths"].setValue("");
      this.mprRevisionModel.GuaranteePeriod == "Not Applicable";
    }
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
    this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
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
      this.MPRItemDetailsSubmitted = false;
      this.itemDetails.RevisionId = this.mprRevisionModel.RevisionId;
      this.mprRevisionModel.MPRItemInfoes = [];
      this.mprRevisionModel.MPRItemInfoes.push(this.itemDetails);
      this.mprRevisionModel.MPRDocuments = this.mprRevisionModel.MPRDocuments.filter(li => li.ItemDetailsId == this.itemDetails.Itemdetailsid);
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
        this.mprRevisionModel = data;
        this.displayItemDialog = false;
      });
    }
  }

  onMPRForm3Submit(formId: string, formEdit: string) {
    this.MPRForm3Submitted = true;
    if (this.MPRPageForm3.invalid) {
      return;
    }
    else {
      //if (this.mprRevisionModel.GuaranteePeriod)
      //  this.mprRevisionModel.GuaranteePeriod = this.mprRevisionModel.GuaranteePeriod[0];
      if (this.MPRPageForm3.value.supplyMonths && this.MPRPageForm3.value.commissionMonths)
        this.mprRevisionModel.GuaranteePeriod = this.MPRPageForm3.value.supplyMonths + " " + "months after supply or " + this.MPRPageForm3.value.commissionMonths + " " + "months after commissioning whichever is earlier";
      if (this.mprRevisionModel.InspectionComments)
        this.mprRevisionModel.InspectionComments = this.mprRevisionModel.InspectionComments[0];
      this.mprRevisionModel.PreparedBy = this.employee.EmployeeNo;
      this, this.mprRevisionModel.PreparedOn = new Date();
      this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
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
    this[dialogName] = true;
    this.vendorDetails = new MPRVendorDetail();
  }


  onDocumentSubmit(dialogName: string, type: string) {
    this.mprRevisionModel.MPRItemInfoes = [];
    if (type == "vendorDetails") {
      this.vendorSubmitted = true;
      if (!this.vendorDetails.VendorName)
        return;
      else {
        this.vendorSubmitted = false;
        this.mprRevisionModel.MPRDocuments = [];
        this.mprRevisionModel.MPRDocumentations = [];
        this.mprRevisionModel.MPRVendorDetails.push(this.vendorDetails);
      }
    }
    else if (type == "documentDetails") {
      this.mprRevisionModel.MPRVendorDetails = [];
      this.mprRevisionModel.MPRDocumentations = [];
      this.MPR3Documents.push(this.mprDocuments);
      this.mprRevisionModel.MPRDocuments = this.MPR3Documents;
    }
    else if (type == "documentations") {
      this.mprRevisionModel.MPRDocuments = [];
      this.mprRevisionModel.MPRVendorDetails = [];
      this.mprRevisionModel.MPRDocumentations.push(this.MPRDocumentations);

    }
    this.MprService.updateMPR(this.mprRevisionModel).subscribe(data => {
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

  getComName(code: number) {
    if (code)
      return this.searchItems.filter(li => li.code == code)[0].name
  }

  removeCommunication(details: MPRReminderTracking) {
    var index = this.MPRCommunications.MPRReminderTrackings.findIndex(x => x.MailTo == details.MailTo);
    this.MPRCommunications.MPRReminderTrackings.splice(index, 1);

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
      this.MPRCommunicationForm.controls['ReminderDate'].updateValueAndValidity()
    }
    else {
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
  onstatusUpdate() {

    this.mprStatusUpdate.typeOfuser = "Checker";
    this.mprStatusUpdate.RevisionId = this.mprRevisionModel.RevisionId;
    this.MprService.statusUpdate(this.mprStatusUpdate).subscribe(data => {
      this.mprRevisionModel = data;
      this.disableStatusSubmit = true;
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Status Updated' });
    })

  }
  fileChange(event: any, formName: string) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      var data = new Blob([file], { type: 'text/plain;charset=utf-8' });
      //saveAs(data, file.name, { type: file.type });
      this.mprDocuments = new MPRDocument();
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
    }
  }


  loadMPRData(revisionId: any) {
    this.MprService.getMPRRevisionDetails(revisionId).subscribe(data => {
      this.mprRevisionModel = data;
      this.MprService.getMprRevisionList(this.mprRevisionModel.RequisitionId).subscribe(data => {
        this.mprRevisionList = data;
        this.mprRevisionDetails = this.mprRevisionList.filter(li => li.RevisionId == this.mprRevisionModel.RevisionId)[0];
        this.bindMPRPageForm("MPRPageForm1", this.mprRevisionDetails );
        this.bindMPRPageForm("MPRItemDetailsForm", this.mprRevisionDetails );
        this.bindMPRPageForm("MPRPageForm2", this.mprRevisionDetails );
        this.bindMPRPageForm("MPRInchargeForm", this.mprRevisionDetails );
        this.bindMPRPageForm("MPRPageForm3", this.mprRevisionDetails );
        this.form1Edit = this.materialFormEdit = this.vendorFormEdit = this.form3Edit = true;
        this.showForm1EditBtn = this.showMaterialEditBtn = this.showVendorEditBtn = this.shoForm3EditBtn = this.showCommEditBtn = this.showCommunicationForm = true;
        this.showMaterialForm = this.showVendorForm = this.showOtherDetailsForm = true;
        this.bindStatusDetails();
        this.showPage = true;
        this.spinner.hide();
      });
     
    });
  }
  //bind Status Details
  bindStatusDetails() {
    this.mprStatusUpdate.status = this.mprRevisionModel.CheckStatus;
    this.mprStatusUpdate.Remarks = this.mprRevisionModel.CheckerRemarks;
    if (this.mprRevisionModel.CheckStatus == "Pending" || this.mprRevisionModel.CheckStatus == "Submitted" || this.mprRevisionModel.CheckStatus == "Sent for Modification")
      this.displayFooter = true;
    else
      this.displayFooter = false;
  }

  bindMPRPageForm(formName: string, data: any) {
    for (let item in this[formName].controls) {
      if ((this.constants[item]) && (data[this.constants[item].fieldAliasName])) {
        this[formName].controls[item].setValue(data[this.constants[item].fieldAliasName])
      }
      else {
        if (this.constants[item]) {
          this.bindSearchListData("", formName, item, "", (): any => {
            this.showList = false;
            if (this.searchItems.filter(li => li.code == data[item]).length > 0)
              this[formName].controls[item].setValue(this.searchItems.filter(li => li.code == data[item])[0].name);
            else {
              if (item == "DispatchLocation") {
                this.specifyDispatchDisply = false;
                this.MPRPageForm3.controls['specifyDispatchLocation'].setValue(data[item]);
                this[formName].controls[item].setValue("Others");
              }
            }
          });
        }
      }
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
  scrollToView(id, navId) {
    var elmnt = document.getElementById(id);
    elmnt.scrollIntoView();
    //var navelmnt = document.getElementById(navId);
    // navelmnt.classList.add("active");
  }
}


