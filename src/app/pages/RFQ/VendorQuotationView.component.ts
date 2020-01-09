import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { RfqService } from 'src/app/services/rfq.service ';
import { QuoteDetails} from 'src/app/Models/rfq';
import { constants } from 'src/app/Models/MPRConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, AccessList } from 'src/app/Models/mpr';

@Component({
  selector: 'app-VendorQuotationView',
  templateUrl: './VendorQuotationView.component.html'
})

export class VendorQuotationViewComponent implements OnInit {

  constructor(public RfqService: RfqService, public constants: constants, private route: ActivatedRoute, private router: Router) { }
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public RfqRevisionId: number = 0;
  public quoteDetails: QuoteDetails;
  public RFQPriceVisibility: boolean = false; 
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");
    if (localStorage.getItem("AccessList")) {
      this.AccessList = JSON.parse(localStorage.getItem("AccessList"));
    }
    if (this.AccessList.filter(li => li.AccessName == "RFQPriceVisibility").length > 0)
      this.RFQPriceVisibility = true;
    this.quoteDetails = new QuoteDetails();
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
    });
  }
}
