import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { RfqService } from 'src/app/services/rfq.service ';
import { QuoteDetails, RFQDocuments, RFQMaster, RFQCommunication } from 'src/app/Models/rfq';
import { constants } from 'src/app/Models/MPRConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, AccessList } from 'src/app/Models/mpr';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-VendorQuotationView',
  templateUrl: './VendorQuotationView.component.html'
})

export class VendorQuotationViewComponent implements OnInit {

  constructor(public RfqService: RfqService, public constants: constants, private route: ActivatedRoute, private router: Router, private messageService: MessageService) { }
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public RfqRevisionId: number = 0;
  public quoteDetails: QuoteDetails;
  public rfqDocuments: Array<RFQDocuments> = [];
  public RFQPriceVisibility: boolean = false;
  public MPRPriceVisibilty: boolean = false;
  public RFQCommunications: RFQCommunication;
  public displayCommunicationDialog: boolean = false;

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");
    this.RFQCommunications = new RFQCommunication();
    if (localStorage.getItem("AccessList")) {
      this.AccessList = JSON.parse(localStorage.getItem("AccessList"));
    }
    if (this.AccessList.filter(li => li.AccessName == "RFQPriceVisibility").length > 0)
      this.RFQPriceVisibility = true;
    if (this.AccessList.filter(li => li.AccessName == "MPRPriceVisibilty").length > 0)
      this.MPRPriceVisibilty = true;
    this.quoteDetails = new QuoteDetails();
    this.quoteDetails.rfqmaster = new RFQMaster();
    this.quoteDetails.rfqitem = [];
    this.quoteDetails.rfqCommunications = [];

    this.route.params.subscribe(params => {
      if (params["RFQRevisionId"]) {
        this.RfqRevisionId = params["RFQRevisionId"];
        this.loadQuotationDetails();
      }
    });
  }

  loadQuotationDetails() {
    this.RfqService.GetRfqDetailsById(this.RfqRevisionId).subscribe(data => {
      this.quoteDetails = data;
      if (this.quoteDetails.mprIncharges.filter(li => li.Incharge == this.employee.EmployeeNo).length > 0)
        this.MPRPriceVisibilty = true;
      for (var i = 0; i < this.quoteDetails.rfqitem.length; i++) {
        this.quoteDetails.rfqitem[i].RFQDocuments.forEach(doc => {
          if (this.rfqDocuments.filter(li => li.RfqItemsId = doc.RfqItemsId).length == 0) {
            doc.StatusBy = this.employee.EmployeeNo;
            doc.Statusdate = new Date();
            this.rfqDocuments.push(doc);
          }
        });
      }
    });
  }
  showRfqCommunicationDialogToAdd() {
    this.RFQCommunications = new RFQCommunication();
    this.displayCommunicationDialog = true;
  }

  dialogCancel() {
    this.displayCommunicationDialog = false;
  }
  onCommnicationSubmit() {
    this.RFQCommunications.RfqRevisionId = this.RfqRevisionId;
    this.RFQCommunications.RemarksFrom = this.employee.EmployeeNo;
    this.RFQCommunications.RemarksDate = new Date();
    this.RfqService.UpdateVendorCommunication(this.RFQCommunications).subscribe(data => {
      if (data) {
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Remarked Added' });
        this.displayCommunicationDialog = false;
        this.quoteDetails.rfqCommunications.push(this.RFQCommunications);
      }
    });
  }

  viewDocument(path: string, documentname: string) {
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.vendorDocumentPath + path1;
    window.open(path1);
  }
  updateRfqDocumentStatus() {
    this.RfqService.updateRfqDocumentStatus(this.rfqDocuments).subscribe(data => {
      if (data)
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Status Updated' });
    });
  }
}
