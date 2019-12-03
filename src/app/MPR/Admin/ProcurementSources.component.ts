import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MPRProcurementSources, DynamicSearchResult } from '../../Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';

@Component({
	selector: 'app-ProcurementSources',
	templateUrl: './ProcurementSources.component.html'
})

export class ProcurementSourcesComponent implements OnInit {

	constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public constants: constants) { }

	public PSAddForm; PSEditForm: FormGroup;
  public PSAddSubmitted: boolean = false;
  public PSEditSubmitted: boolean = false;
	public dataSaved: boolean = false;
  public procSrc: Array<MPRProcurementSources>=[];
	public editPS: MPRProcurementSources;
	public AddDialog: boolean;
	public EditDialog: boolean;
  public dynamicData = new DynamicSearchResult();
  public addDynamicData = new DynamicSearchResult();
  public updateDynamicData1 = new DynamicSearchResult();
  public updateDynamicData2 = new DynamicSearchResult();

  ngOnInit() {
    this.procSrc = [];
    this.editPS = new MPRProcurementSources();
    this.loadProcurementSources();

    this.PSAddForm = this.formBuilder.group({
      ProcurementSource: ['', [Validators.required]],
    });

    this.PSEditForm = this.formBuilder.group({
      ProcurementSource: ['', [Validators.required]],
      BoolInUse: ['', [Validators.required]],
    });
  }

	loadProcurementSources() {
      this.dynamicData.tableName = this.constants["ProcurementSourceId"].tableName;
      this.dynamicData.sortBy = "boolInUse desc, ProcurementSourceId";
      this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
			this.procSrc = data;
		});
	}

	ShowAddDialog() {
		this.AddDialog = true;
		this.PSAddForm.reset();//To reset the values entered previously
		this.PSAddSubmitted = false;//Removes the Validation error when attempted to click the Add button 
	}
  InsertData() {
    this.PSAddSubmitted = true;
    if (this.PSAddForm.invalid) {
      return;
    }
    else {
      const psAddDialogData = this.PSAddForm.value;
      localStorage.setItem("ProcurementSource", psAddDialogData.ProcurementSource);

      this.addDynamicData.tableName = this.constants["ProcurementSourceId"].tableName;
      this.addDynamicData.columnNames = "ProcurementSource";
      this.addDynamicData.columnValues = psAddDialogData.ProcurementSource;

      this.MprService.addDataToDBMasters(this.addDynamicData).subscribe(
        () => {
          this.dataSaved = true;
          this.loadProcurementSources();
        });
      this.AddDialog = false;
    }
  }

  onRowEditInit(e: any, formName: string, details: any, name: string) {
    this.editPS = new MPRProcurementSources();
		this.editPS = details;
		this.EditDialog = true;
  }

  UpdateData() {
    this.PSEditSubmitted = true;
    if (this.PSEditForm.invalid) {
      return
    }
    else {
      this.dynamicData.tableName = this.constants["ProcurementSourceId"].tableName;
      this.dynamicData.query = "update " + this.dynamicData.tableName + " set ProcurementSource='" + this.editPS.ProcurementSource + "',BoolInUse='" + this.editPS.BoolInUse + "' WHERE ProcurementSourceId=" + this.editPS.ProcurementSourceId;
      //this.dynamicData.tableName = this.constants["ProcurementSourceId"].tableName;
      //this.dynamicData.tableName = this.constants["ProcurementSourceId"].fieldName;
      //this.dynamicData.updateCondition.columnValues = psAddDialogData.ProcurementSource;
      this.MprService.updateDataToDBMasters(this.dynamicData).subscribe(
        () => {
          this.dataSaved = true;
          this.loadProcurementSources();
          this.EditDialog = false;
        });
    }
  }

	Cancel() {
		this.AddDialog = false;
		this.EditDialog = false;
	}
}
