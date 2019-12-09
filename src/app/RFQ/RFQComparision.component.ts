import { Component, OnInit } from '@angular/core';
import { constants } from '../Models/MPRConstants'
import { ActivatedRoute } from '@angular/router';
import { RfqService } from '../services/rfq.service ';
import { MPRVendorDetail, searchList, DynamicSearchResult } from '../Models/mpr';
import { MprService } from '../services/mpr.service';
import { rfqQuoteModel, RFQRevisionData } from '../Models/rfq';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-RFQComparision',
  templateUrl: './RFQComparision.component.html'
})

export class RFQComparisionComponent implements OnInit {
  constructor(public RfqService: RfqService, public MprService: MprService, public constants: constants, private route: ActivatedRoute, private messageService: MessageService) { }

  
  public rfqQuoteModel: Array<rfqQuoteModel> = [];
  public vendorsLength: number = 2;
  public selectedIndex: string;
  public selectedVendorList: Array<any> = [];
  public cols: any[];
  public RFQRevisionData: RFQRevisionData;
  //page load event
  ngOnInit() {
    
  }

  
  bindCheckeMark(vendor: any, ItemId: number) {
    return this.selectedVendorList.filter(li => (li.VendorId == vendor.VendorId) && (li.ItemId == ItemId)).length > 0 ? true : false;

  }

 
}


