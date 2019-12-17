import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Department,Employee, DynamicSearchResult } from '../../Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';

@Component({
  selector: 'app-Departments',
  templateUrl: './Departments.component.html'
})

export class DepartmentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public constants: constants) { }

  public DeptAddForm; DeptEditForm: FormGroup;
  public DeptAddSubmitted: boolean = false;
  public DeptEditSubmitted: boolean = false;
  public dataSaved: boolean = false;
  public Departments: Array<Department> = [];
  public editDepartment: Department;
  public Department: Department;
  public AddDialog: boolean;
  public EditDialog: boolean;
  public employee: Array<Employee> = [];
  public dynamicData = new DynamicSearchResult();
  public addDynamicData = new DynamicSearchResult();
  public updateDynamicData1 = new DynamicSearchResult();
  public updateDynamicData2 = new DynamicSearchResult();
  public query: string = "";
  public columnNames: string = "Department";
  public columnValues: string = "";

  ngOnInit() {
    this.Departments = [];
    this.editDepartment = new Department();
    this.loadDepartments();
    this.employee = [];

    this.DeptAddForm = this.formBuilder.group({
      Department: ['', [Validators.required]],
      SecondApproverEmpNo: ['', [Validators.required]],
      ThirdApproverEmpNo: ['', [Validators.required]],
    });
    this.DeptAddForm.controls["SecondApproverEmpNo"].clearValidators();
    this.DeptAddForm.controls["ThirdApproverEmpNo"].clearValidators();

    this.DeptEditForm = this.formBuilder.group({
      Department: ['', [Validators.required]],
      BoolInUse: ['', [Validators.required]],
      SecondApproverEmpNo: ['', [Validators.required]],
      ThirdApproverEmpNo: ['', [Validators.required]],
    });
    this.DeptEditForm.controls["SecondApproverEmpNo"].clearValidators();
    this.DeptEditForm.controls["ThirdApproverEmpNo"].clearValidators();
  }

  loadDepartments() {
    this.dynamicData.tableName = "";
    this.dynamicData.query = "SELECT MPRDepartments.DepartmentId,MPRDepartments.Department,MPRDepartments.SecondApprover As SecondApproverEmpNo,SecondApprover.Name As SecondApproverName,MPRDepartments.ThirdApprover As ThirdApproverEmpNo,ThirdApprover.Name As ThirdApproverName,MPRDepartments.BoolInUse FROM MPRDepartments LEFT OUTER JOIN Employee As SecondApprover ON MPRDepartments.SecondApprover=SecondApprover.EmployeeNo LEFT OUTER JOIN Employee As ThirdApprover ON MPRDepartments.ThirdApprover=ThirdApprover.EmployeeNo WHERE MPRDepartments.BoolInUse=1 ORDER BY MPRDepartments.BoolInUse,MPRDepartments.Department";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.Departments = data;
    });
  }
  loadEmployees() {
    this.dynamicData.tableName = "";
    this.dynamicData.query = "SELECT Employee.EmployeeNo,Employee.Name FROM Employee WHERE Employee.DOL IS NULL AND Employee.OrganizationId=1 ORDER BY Employee.Name";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.employee = data;

    });
  }

  showDialogAddDepartment() {
    this.AddDialog = true;
    this.DeptAddForm.reset();//To reset the values entered previously
    this.DeptAddSubmitted = false;//Removes the Validation error when attempted to click the Add button
    this.loadEmployees();
    this.DeptAddForm.SecondApproverEmpNo = "0";
    this.DeptAddForm.ThirdApproverEmpNo = "0";
  }
  InsertData() {
    this.DeptAddSubmitted = true;
    if (this.DeptAddForm.invalid) {
      return;
    }
    else {
      this.Department = this.DeptAddForm.value;
      this.addDynamicData.tableName = "MPRDepartments";
      this.columnValues =this.Department.Department;
      if (this.Department.SecondApproverEmpNo != "0") {
        this.columnNames += ",SecondApprover";
        this.columnValues += "," + this.Department.SecondApproverEmpNo;
      }
      if (this.Department.ThirdApproverEmpNo != "0") {
        this.columnNames += ",ThirdApprover";
        this.columnValues += ","+this.Department.ThirdApproverEmpNo;
      }
      this.addDynamicData.columnNames = this.columnNames;
      this.addDynamicData.columnValues = this.columnValues;

      this.MprService.addDataToDBMasters(this.addDynamicData).subscribe(
        () => {
          this.dataSaved = true;
          this.loadDepartments();
        });
      this.AddDialog = false;
    }
  }

  onRowEditInit(e: any, formName: string, details: any, name: string) {
    this.editDepartment  = new Department();
    this.editDepartment = details;
    this.loadEmployees();
    this.EditDialog = true;
    this.editDepartment.SecondApproverEmpNo = "0";
    this.editDepartment.ThirdApproverEmpNo = "0";
  }

  UpdateData() {
    this.DeptEditSubmitted = true;
    if (this.DeptEditForm.invalid) {
      return
    }
    else {
      this.dynamicData.tableName = "MPRDepartments";
      this.query = "update " + this.dynamicData.tableName + " set Department='" + this.editDepartment.Department + "'";
      if (this.editDepartment.SecondApproverEmpNo != "0") {
        this.query += ", SecondApprover = '" + this.editDepartment.SecondApproverEmpNo + "'";
      }
      if (this.editDepartment.ThirdApproverEmpNo != "0") {
        this.query += ", ThirdApprover = '" + this.editDepartment.ThirdApproverEmpNo + "'";
      }
      this.query += ",BoolInUse='" + this.editDepartment.BoolInUse + "' WHERE DepartmentId=" + this.editDepartment.DepartmentId;
      this.dynamicData.query = this.query;
      //this.dynamicData.tableName = this.constants["ProcurementSourceId"].tableName;
      //this.dynamicData.tableName = this.constants["ProcurementSourceId"].fieldName;
      //this.dynamicData.updateCondition.columnValues = psAddDialogData.ProcurementSource;
      this.MprService.updateDataToDBMasters(this.dynamicData).subscribe(
        () => {
          this.dataSaved = true;
          this.loadDepartments();
          this.EditDialog = false;
        });
    }
  }

  Cancel() {
    this.AddDialog = false;
    this.EditDialog = false;
  }



}
