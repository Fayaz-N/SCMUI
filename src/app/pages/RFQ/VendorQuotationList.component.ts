import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { RfqService } from '../../services/rfq.service ';
import { constants } from '../../Models/MPRConstants'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RFQMasters,RFQRevisionData } from '../../Models/rfq';

@Component({
	selector: 'app-VendorQuotationList',
	templateUrl: './VendorQuotationList.component.html'
})
export class VendorQuotationListComponent implements OnInit {
	constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public RfqService: RfqService, public constants: constants, private route: ActivatedRoute) { }
	public VendorId: number = 0;
	public VendorQuotationList: FormGroup;
	public rfqMastersModel: Array<RFQMasters>;
	public rfqRevisions: RFQRevisionData;

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params["VendorId"]) {
				this.VendorId = params["VendorId"];
			}
      });

		//this.VendorId = 7;
		this.rfqMastersModel = []
		this.rfqRevisions = new RFQRevisionData();

		this.RfqService.GetRfqByVendorId(this.VendorId).subscribe(data => {
		  this.rfqMastersModel = data;
		});
		//this.RfqService.getallrfqlist().subscribe(data => {
		//	this.rfqMastersModel = data;
		//});

		this.VendorQuotationList = this.formBuilder.group({

		});
	}
}
