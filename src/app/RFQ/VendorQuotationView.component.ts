import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { DynamicSearchResult } from '../Models/mpr';
import { RfqService } from 'src/app/services/rfq.service ';
import { RfqItemInfoModel, RFQUnitMasters, RFQCurrencyMaster, RfqItemModel } from '../Models/rfq';
import { constants } from 'src/app/Models/MPRConstants';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-VendorQuotationView',
  templateUrl: './VendorQuotationView.component.html'
})

export class VendorQuotationViewComponent implements OnInit {

  constructor( public RfqService: RfqService, public constants: constants, private route: ActivatedRoute) { }
  public RfqRevisionId: number = 0;
  public quoteDetails: Array<any> = [];
 
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params["RFQRevisionId"]) {
        this.RfqRevisionId = params["RFQRevisionId"];
        this.loadQuotationDetails();
      }
    });



  }

  loadQuotationDetails() {
    this.RfqService.GetItemsByRevisionId(this.RfqRevisionId).subscribe(data => {
      this.quoteDetails = data;
    });
  }




}
