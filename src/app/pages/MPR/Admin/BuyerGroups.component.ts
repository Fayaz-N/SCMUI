import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MPRBuyerGroup, searchList, DynamicSearchResult } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { RfqService } from 'src/app/services/rfq.service ';
import { constants } from 'src/app/Models/MPRConstants';

@Component({
  selector: 'app-BuyerGroups',
  templateUrl: './BuyerGroups.component.html'
})

export class BuyerGroupsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public constants: constants) { }
  @ViewChild('dialog', { read: ElementRef, static: true })
  protected dialogElement: ElementRef;

  public BuyerGroupsAddForm; BuyerGroupsEditForm: FormGroup;
  public dataSaved: boolean;
  public buyerGrps: Array<MPRBuyerGroup> = [];
  public editbuyerGrps: MPRBuyerGroup;
  public addbuyerGrp: MPRBuyerGroup;
  public AddDialog: boolean;
  public EditDialog: boolean;
  public selectedItem: searchList;
  public searchItems: Array<searchList> = [];
  public dynamicSearchResult = new DynamicSearchResult();
  public selectedlist: Array<searchList> = [];
  public BGAddSubmitted: boolean;

  ngOnInit() {
    this.buyerGrps = [];
    this.editbuyerGrps = new MPRBuyerGroup();
    this.addbuyerGrp = new MPRBuyerGroup();
    this.BGAddSubmitted = false;
    this.loadBuyerGroups();

    this.BuyerGroupsAddForm = this.formBuilder.group({
      BuyerGroup: ['', [Validators.required]],
    });

    this.BuyerGroupsEditForm = this.formBuilder.group({
      BuyerGroup: ['', [Validators.required]],
      BoolInUse: ['', [Validators.required]],
    });
  }
  loadBuyerGroups() {
    this.MprService.getMPRBuyerGroups().subscribe(data => {
      this.buyerGrps = data;
    });
  }

  showDialogToAddBuyerGroup() {
    this.AddDialog = true;
  }

  onBuyerGroupAdd() {
    this.BGAddSubmitted = true;
    if (this.BuyerGroupsAddForm.invalid) {
      return
    }
    else {
      const bgAdd = this.BuyerGroupsAddForm.value;
      localStorage.setItem("BuyerGroup", bgAdd.BuyerGroup);
      this.addBuyerGrps(bgAdd)
      this.AddDialog = false;
    }
  }

  addBuyerGrps(bg: MPRBuyerGroup) {
    this.MprService.addMPRBuyerGroup(bg).subscribe(
      () => {
        this.dataSaved = true;
        this.loadBuyerGroups();
        this.BuyerGroupsAddForm.reset();
      });
  }

  Cancel() {
    this.AddDialog = false;
    this.EditDialog = false;
  }

  onRowEditInit(e: any, formName: string, details: MPRBuyerGroup, name: string) {
    this.editbuyerGrps = details;
    this.EditDialog = true;
  }

  onBuyerGroupUpdate() {
    if (this.BuyerGroupsEditForm.invalid) {
      return
    }
    else {
      this.MprService.updateMPRBuyerGroup(this.editbuyerGrps).subscribe(
        () => {
          this.dataSaved = true;
          this.loadBuyerGroups();
          this.BuyerGroupsEditForm.reset();
        });
      this.loadBuyerGroups();
      this.EditDialog = false;
    }
  }

  public bindSearchListData(e: any, formName: string, name: string, searchTxt: string, callback: () => any): void {
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicSearchResult.tableName = this.constants[name].tableName;
    this.dynamicSearchResult.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    this.MprService.getDBMastersList(this.dynamicSearchResult).subscribe(data => {
    });
  }
}
