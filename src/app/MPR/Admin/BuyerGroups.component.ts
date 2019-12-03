import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MPRBuyerGroup, searchList, DynamicSearchResult } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
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
  public buyerGrps: MPRBuyerGroup;
  public editbuyerGrps: MPRBuyerGroup;
  public AddDialog: boolean;
  public EditDialog: boolean;
  public selectedItem: searchList;
  public searchItems: Array<searchList> = [];
  public dynamicSearchResult = new DynamicSearchResult();
  public selectedlist: Array<searchList> = [];
  public BGAddSubmitted: boolean;

  ngOnInit() {
    this.buyerGrps = new MPRBuyerGroup();
    this.editbuyerGrps = new MPRBuyerGroup();
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
    this.dynamicSearchResult.tableName = "MPRBuyerGroups";
    this.MprService.getDBMastersList(this.dynamicSearchResult).subscribe(data => {
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
    this.dynamicSearchResult.tableName = "MPRBuyerGroups";
    this.dynamicSearchResult.columnNames = "BuyerGroup";
    this.dynamicSearchResult.columnValues = bg.BuyerGroup;
    this.MprService.addDataToDBMasters(this.dynamicSearchResult).subscribe(
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
      this.dynamicSearchResult.query = "UPDATE MPRBuyerGroups SET BuyerGroup='" + this.editbuyerGrps.BuyerGroup + "',BoolInUse='" + this.editbuyerGrps.BoolInUse + "' WHERE MPRBuyerGroups.BuyerGroupId=" + this.editbuyerGrps.BuyerGroupId;
      this.MprService.updateDataToDBMasters(this.dynamicSearchResult).subscribe(data => {
        this.editbuyerGrps = data
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
