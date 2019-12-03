import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MPRScope, searchList, DynamicSearchResult } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';

@Component({
  selector: 'app-Scopes',
  templateUrl: './Scopes.component.html'
})

export class ScopesComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public constants: constants) { }
  @ViewChild('dialog', { read: ElementRef, static: true })
  protected dialogElement: ElementRef;

  public MPRScopesAddForm; MPRScopesEditForm: FormGroup;
  public dataSaved: boolean;
  public mprScopes: MPRScope;
  public editMPRScopes: MPRScope;
  public AddDialog: boolean;
  public EditDialog: boolean;
  public dynamicSearchResult: DynamicSearchResult;

  ngOnInit() {
    this.mprScopes = new MPRScope();
    this.editMPRScopes = new MPRScope();
    this.dynamicSearchResult = new DynamicSearchResult();
    this.loadMPRScopes();

    this.MPRScopesAddForm = this.formBuilder.group({
      Scope: ['', [Validators.required]],
    });

    this.MPRScopesEditForm = this.formBuilder.group({
      Scope: ['', [Validators.required]],
      BoolInUse: ['', [Validators.required]],
    });
  }

  loadMPRScopes() {
    this.dynamicSearchResult.tableName = "MPRScopes";
    this.MprService.getDBMastersList(this.dynamicSearchResult).subscribe(data => this.mprScopes = data);
  }

  Cancel() {
    this.AddDialog = false;
    this.EditDialog = false;
  }

  onRowEditInit(e: any, formName: string, details: MPRScope, name: string) {
    this.editMPRScopes = details;
    this.EditDialog = true;
  }

  onMPRScopeAdd() {
    if (this.MPRScopesAddForm.invalid) {
      return
    }
    else {
      const scopeAdd = this.MPRScopesAddForm.value;
      localStorage.setItem("Scope", scopeAdd.Scope);
      this.addMPRScope(scopeAdd)
      this.AddDialog = false;
    }
  }

  addMPRScope(ScopesComponent: MPRScope) {
    this.dynamicSearchResult = new DynamicSearchResult();
    this.dynamicSearchResult.tableName = "MPRScopes";
    this.dynamicSearchResult.columnNames = "Scope";
    this.dynamicSearchResult.columnValues = ScopesComponent.Scope;
    this.MprService.addDataToDBMasters(this.dynamicSearchResult).subscribe(
      () => {
        this.dataSaved = true;
        this.loadMPRScopes();
        this.MPRScopesAddForm.reset();
      });
  }

  onMPRScopeUpdate() {
    if (this.MPRScopesEditForm.invalid) {
      return
    }
    else {
     // const scopeEdit = this.MPRScopesEditForm.value;
      this.dynamicSearchResult = new DynamicSearchResult();
      this.dynamicSearchResult.tableName = "MPRScopes";
      this.dynamicSearchResult.query = "UPDATE MPRScopes SET Scope='" + this.editMPRScopes.Scope + "',BoolInUse='" + this.editMPRScopes.BoolInUse + "' WHERE ScopeId=" + this.editMPRScopes.ScopeId;
      this.MprService.updateDataToDBMasters(this.dynamicSearchResult).subscribe(data => {
        this.editMPRScopes = data
        this.loadMPRScopes();
      });
      this.EditDialog = false;
      
    }
  }

  showDialogToAddMPRScope() {
    this.AddDialog = true;
  }


}
