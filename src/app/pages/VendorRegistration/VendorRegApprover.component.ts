import { Component, OnInit } from '@angular/core';
import { VendorDocDetailsList, VendorRegistration, DynamicSearchResult } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { constants } from 'src/app/Models/MPRConstants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-Approver',
  templateUrl: './VendorRegApprover.component.html',
})
export class VendorRegisterApproverComponent implements OnInit {
  constructor(private messageService: MessageService, private router: Router, private formBuilder: FormBuilder, public constants: constants, private spinner: NgxSpinnerService, public MprService: MprService) { }
  VendorRegister: FormGroup;
  public vendorDocuments: VendorDocDetailsList;
  public VQAddSubmitted: boolean = false;
  public VendorData: VendorRegistration;
  public VendorDataLocDetails: VendorRegistration;
  public dynamicData = new DynamicSearchResult();
  public paymentTermsList: Array<any> = [];
  StateList: any[] = [];
  CurrencyList: any[] = [];
  NaturOfBusinessList: any[] = [];
  DocumentList: any[] = [];
  isDisabledaddress = true;
  isDisabledGST: boolean = true;
  isDisabledPAN: boolean = true;
  isDisabledCIN: boolean = true;
  isDisabledBank: boolean = true;
  isDisabledCheque: boolean = true;
  isDisabledInspecter: boolean = true;
  isDisabledESI: boolean = true;
  isDisabledPollution: boolean = true;
  isDisabledExcise: boolean = true;
  isDisabledGSTChange: boolean = true;
  isDisabledIncorporation: boolean = true;
  isDisabledPANChange: boolean = true;
  isDisableOtherDoc: boolean = true;
  isDisableTaxDoc: boolean = true;
  isDisableForm10Doc: boolean = true;
  public typeOfUser: string;

  ngOnInit() {
    if (localStorage.getItem("vendorRegDetails"))
      this.VendorDataLocDetails = JSON.parse(localStorage.getItem("vendorRegDetails"));
    else
      this.router.navigateByUrl("vendorRegDetails");

    this.VendorData = new VendorRegistration();
    this.VendorData.DocDetailsLists = [];
    this.VendorData.ESI = "1";
    this.VendorRegister = this.formBuilder.group({
      orders: [''],
      State: ['', [Validators.required]],
      street: ['', [Validators.required]],
      VendorName: ['', [Validators.required]],
      Country: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Onetimevendor: ['', [Validators.required]],
      showEvaluation: ['', [Validators.required]],
      PerformanceVerificationRequired: ['', [Validators.required]],
      MSME: ['', [Validators.required]],
      LocalBranch: ['', [Validators.required]],
      PostalCode: ['', [Validators.required]],
      //BusinessArea: ['', [Validators.required]],
      PhoneExn: ['', [Validators.required]],
      Mobile: ['', [Validators.required]],
      //email: ['', [Validators.required]],
      //AltEmail: ['', [Validators.required]],
      Fax: ['', [Validators.required]],
      ContactPersonForSales: ['', [Validators.required]],
      PhoneNumberForSales: ['', [Validators.required]],
      EmailIdForSales: ['', [Validators.required]],
      AltEmailidForSales: ['', [Validators.required]],
      ContactPersonForOperations: ['', [Validators.required]],
      PhoneNumberForOperations: ['', [Validators.required]],
      EmailIdForOperations: ['', [Validators.required]],
      AltEmailidForOperations: ['', [Validators.required]],
      ContactPersonForLogistics: ['', [Validators.required]],
      PhoneNumberForLogistics: ['', [Validators.required]],
      EmailIdForLogistics: ['', [Validators.required]],
      AltEmailidForLogistics: ['', [Validators.required]],
      ContactPersonForAccounts: ['', [Validators.required]],
      PhoneNumberForAccounts: ['', [Validators.required]],
      EmailIdForAccounts: ['', [Validators.required]],
      AltEmailidForAccounts: ['', [Validators.required]],
      GSTNo: ['', [Validators.required]],
      PANNo: ['', [Validators.required]],
      CINNo: ['', [Validators.required]],
      TanNo: ['', [Validators.required]],
      PaymentTerms: ['', [Validators.required]],
      BankerName: ['', [Validators.required]],
      LocationOrBranch: ['', [Validators.required]],
      AccNo: ['', [Validators.required]],
      IFSCCode: ['', [Validators.required]],
      IncoTerms: ['', [Validators.required]],
      AccountHolderName: ['', [Validators.required]],
      NaturOfBusiness: ['', [Validators.required]],
      SpecifyNatureOfBusiness: ['', [Validators.required]],
      SwiftCode: ['', [Validators.required]],
      Currency: ['', [Validators.required]],
      ESI: ['', [Validators.required]],
      //BankDetails: ['', [Validators.required]],
    });
    //remove validation for unwanted fields.
    this.VendorRegister.controls['Fax'].clearValidators();
    //this.VendorRegister.controls['PhoneExn'].clearValidators();
    this.VendorRegister.controls['PaymentTerms'].clearValidators();
    this.VendorRegister.controls['AltEmailidForSales'].clearValidators();
    this.VendorRegister.controls['AltEmailidForOperations'].clearValidators();
    this.VendorRegister.controls['AltEmailidForLogistics'].clearValidators();
    this.VendorRegister.controls['AltEmailidForAccounts'].clearValidators();
    this.VendorRegister.controls['ContactPersonForOperations'].clearValidators();
    this.VendorRegister.controls['PhoneNumberForOperations'].clearValidators();
    this.VendorRegister.controls['EmailIdForOperations'].clearValidators();
    this.VendorRegister.controls['ContactPersonForLogistics'].clearValidators();
    this.VendorRegister.controls['PhoneNumberForLogistics'].clearValidators();
    this.VendorRegister.controls['EmailIdForLogistics'].clearValidators();
    this.VendorRegister.controls['ContactPersonForAccounts'].clearValidators();
    this.VendorRegister.controls['PhoneNumberForAccounts'].clearValidators();
    this.VendorRegister.controls['EmailIdForAccounts'].clearValidators();
    this.VendorRegister.controls['CINNo'].clearValidators();
    this.VendorRegister.controls['TanNo'].clearValidators();
    this.VendorRegister.controls['SpecifyNatureOfBusiness'].clearValidators();
    this.VendorRegister.controls['ESI'].clearValidators();
    this.VendorRegister.controls['SwiftCode'].clearValidators();

    //Load drop downs and data binding
    this.StateListdata();
    this.getCurrencyData();
    this.NOfBusinessListdata();
    this.DocumentListdata();
    this.getPaymentTerms();
    this.getvendordetails();

  }
  //Get StateList Data
  StateListdata() {
    this.MprService.GetStateList().subscribe(res => {
      this.StateList = res;
    });
  }

  //get Currency master
  getCurrencyData() {
    this.spinner.show();
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from CurrencyMaster where DeleteFlag=0";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.spinner.hide();
      this.CurrencyList = data;
    });
  }

  //get Documnet ty
  DocumentListdata() {
    this.MprService.GetDocumentTypeList().subscribe(res => {
      this.DocumentList = res;
      let _list: any[] = [];
      for (let i = 0; i < (res.length); i++) {
        _list.push({
          DocumentName: res[i].Documentype,
          DocId: res[i].DocumentationTypeId
        });
      }
      this.DocumentList = _list;
    });
  }


  NOfBusinessListdata() {
    this.MprService.GetNatureofBusinessList().subscribe(res => {
      //this._list = res; //save posts in array
      this.NaturOfBusinessList = res;
      let _list: any[] = [];
      for (let i = 0; i < (res.length); i++) {
        _list.push({
          NatureofbusinessName: res[i].NatureOfBusinessType,
          NaturofBusinessId: res[i].Id
        });
      }
      this.NaturOfBusinessList = _list;
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

  onDDLChange(id: string, enableId, disableSel: string) {
    if (id == enableId)
      this[disableSel] = false;
    else
      this[disableSel] = true;
  }

  //term change
  termChange(term: any) {
    this.VendorData.PaymentTermId = term.PaymentTermId;
    if (term.PaymentTermId != 19) {
      this.VendorData.PaymentTerms = "";
    }

  }

  getvendordetails() {
    this.spinner.show();
    this.MprService.getvendordetails(this.VendorDataLocDetails.Vendorid).subscribe(data => {
      this.spinner.hide();
      this.VendorData = data;
      if (this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 8).length > 0)
        this.VendorData.ESI = "1";
      else
        this.VendorData.ESI = "0";
      this.natureOfBusinessChange();
      this.CheckValidations();
      //this.listOfFiles1 = this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 1);
      //this.VendorRegister.controls['Onetimevendor'].setValue(data["Onetimevendor"])
    })
  }

  //check validations based on vendor type
  CheckValidations() {
    if (this.VendorData.VendorType == true) {
      this.VendorRegister.controls['MSME'].clearValidators();
      this.VendorRegister.controls['State'].clearValidators();
      this.VendorRegister.controls['GSTNo'].clearValidators();
      this.VendorRegister.controls['PANNo'].clearValidators();
      this.VendorRegister.controls['IFSCCode'].clearValidators();

      this.VendorRegister.controls['MSME'].updateValueAndValidity();
      this.VendorRegister.controls['State'].updateValueAndValidity();
      this.VendorRegister.controls['GSTNo'].updateValueAndValidity();
      this.VendorRegister.controls['PANNo'].updateValueAndValidity();
      this.VendorRegister.controls['IFSCCode'].updateValueAndValidity();
    }

    if (this.VendorData.VendorType == false) {
      this.VendorRegister.controls['Country'].clearValidators();
      this.VendorRegister.controls['Country'].updateValueAndValidity();
    }
  }
  natureOfBusinessChange() {
    if (this.VendorData.NatureofBusiness == 4) {
      this.VendorRegister.controls['SpecifyNatureOfBusiness'].setValidators([Validators.required]);
    }
    else {
      this.VendorRegister.controls['SpecifyNatureOfBusiness'].clearValidators();
      this.VendorData.SpecifyNatureOfBusiness = "";
    }

    this.VendorRegister.controls['SpecifyNatureOfBusiness'].updateValueAndValidity();
  }

  FinalSubmit() {
    this.VQAddSubmitted = true;
    if (this.VendorRegister.invalid) {
      return;
    }
    //check documents
    if (this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 1).length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Address Proof' });
      return;
    }
    //VendorType 0 - local vendor, 1- foreignvendor
    if (this.VendorData.VendorType == false && this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 2).length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select GST Registration Certificate' });
      return;
    }
    if (this.VendorData.VendorType == false && this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 3).length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select PAN Copy' });
      return;
    }
    if (this.VendorData.VendorType == false && this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 6).length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Cancelled Cheque Copy' });
      return;
    }
    if (this.VendorData.VendorType == false && this.VendorData.MSMERequired == true && this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 15).length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select MSME Document' });
      return;
    }
    if (this.VendorData.VendorType == false && this.VendorData.ESI == "1" && this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 8).length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select ESI/PF' });
      return;
    }

    if (this.VendorData.VendorType == false && this.VendorData.ESI == "0" && this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 16).length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Declaration On Letter Head' });
      return;
    }
    if (this.VendorData.VendorType == true && this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == 5).length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Bank Mandate duly signed by banker' });
      return;
    }
    else {
      if (this.VendorData.VendorType == false)
      this.VendorData.State = this.StateList.filter(li => li.StateId == this.VendorData.StateId)[0].StateName;
      this.VendorData.CurrencyName = this.CurrencyList.filter(li => li.CurrencyId == this.VendorData.CurrencyId)[0].CurrencyName;

      this.VendorData.Onetimevendor == true ? this.VendorData.Onetimevendor = true : this.VendorData.Onetimevendor = false;
      this.VendorData.EvaluationRequired == true ? this.VendorData.EvaluationRequired = true : this.VendorData.EvaluationRequired = false;
      this.VendorData.PerformanceVerificationRequired == true ? this.VendorData.PerformanceVerificationRequired = true : this.VendorData.PerformanceVerificationRequired = false;
      this.VendorData.MSMERequired == true ? this.VendorData.MSMERequired = true : this.VendorData.MSMERequired = false;

      this.spinner.show();
      this.MprService.SaveVendorDetails(this.VendorData).subscribe(data => {
        this.spinner.hide();
        if (data) {
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Data Submitted' });
          localStorage.removeItem("vendorRegDetails");
          //back to intiate page
          this.router.navigate(['/SCM/VendorRegInitiate', this.VendorDataLocDetails.Vendorid]);
        }

      })
    }

  }

  fileattached(event: any, docId: any) {
    let fileList: FileList = event.target.files;
    var docTypeId;
    if (docId == "15")
      docTypeId = docId;
    else
      docTypeId = document.getElementById(docId)["value"];
    let idanddocid = this.VendorDataLocDetails.VUniqueId + "_" + this.VendorDataLocDetails.Vendorid + "_" + docTypeId + "_" + "VendorReg";
    let formData: FormData = new FormData();
    if (fileList.length > 0) {
      //for (let i = 0; i <= fileList.length - 1; i++) {
      let file: File = fileList[0];
      formData.append(idanddocid, file, idanddocid + "_" + file.name);

      //}
      this.spinner.show();
      this.MprService.uploadFile(formData).subscribe(data => {

        this.vendorDocuments = new VendorDocDetailsList();
        this.vendorDocuments.UploadedBy = this.VendorDataLocDetails.VUniqueId;
        this.vendorDocuments.DocumentName = idanddocid + "_" + file.name;
        this.vendorDocuments.DocumentationTypeId = docTypeId;
        this.vendorDocuments.VendorId = this.VendorDataLocDetails.Vendorid;
        this.vendorDocuments.PhysicalPath = data;
        this.VendorData.DocDetailsLists.push(this.vendorDocuments);
        this.spinner.show();
        this.MprService.UploadVendorRegFile(formData).subscribe(data => {
          this.spinner.hide();
          if (data != null) {
            //alert("Sucessfully updated in YSCM");
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'File inserted' });
          }
        })
      })
    }
  }

  viewDocument(path: string) {
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.Documnentpath + path1;
    window.open(path1);
  }


  removeSelectedFile(document: any, index: any) {
    if (document.Id) {
      var index1 = this.VendorData.DocDetailsLists.findIndex(x => x.Id == document.Id);
      this.spinner.show();
      this.MprService.deleteRegAttachedfile(document).subscribe(data => {
        this.spinner.hide();
        if (data) {
          this.VendorData.DocDetailsLists.splice(index1, 1);
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Deleted' });
        }
      })
    }
    else {
      //var result = this.VendorData.DocDetailsLists.filter(li => li.DocumentationTypeId == document.DocumentationTypeId);
      //var index2 = this.VendorData.DocDetailsLists.findIndex(x => x.DocumentationTypeId == document.DocumentationTypeId);

      this.VendorData.DocDetailsLists.splice(index, 1);
    }
  }

  //navigate to iniate page
  navigateToIntiatePage() {
    this.router.navigate(['/SCM/VendorRegInitiate', this.VendorDataLocDetails.Vendorid]);
  }
}
