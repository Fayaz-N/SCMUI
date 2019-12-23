import { Component, OnInit } from '@angular/core'
import {DynamicSearchResult, Employee, ProjectManager } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-ProjectManagers',
  templateUrl: './ProjectManagers.component.html'

})

export class ProjectManagersComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public MprService: MprService, public constants: constants) { }
  public PMAddForm: FormGroup;
  public ProjectManagers: ProjectManager;
  public dynamicSearchResult: DynamicSearchResult;
  public employee: Array<Employee> = [];
  public EmpModel: Employee
  public AddDialog: boolean;
  public AddSubmitted: boolean = false;
  public selectedApprover: Employee;
  public approverDefaultValue: Number;
  public dataSaved: boolean;

  ngOnInit() {
    this.ProjectManagers = new ProjectManager();
    this.dynamicSearchResult = new DynamicSearchResult();
    this.EmpModel = new Employee();
    this.employee = [];
    this.loadProjectManagers();
    this.PMAddForm = this.formBuilder.group({
      EmployeeNo: ['', [Validators.required]]
    });

  }

  loadProjectManagers() {
    this.dynamicSearchResult.tableName = "";
    this.dynamicSearchResult.query = "SELECT GlobalGroupEmployees.EmployeeNo,Employee.Name FROM GlobalGroupEmployees INNER JOIN Employee ON GlobalGroupEmployees.EmployeeNo=Employee.EmployeeNo ORDER BY Employee.Name";
    this.MprService.getDBMastersList(this.dynamicSearchResult).subscribe(data => this.ProjectManagers = data);
  }

  loadEmployees() {
    this.dynamicSearchResult = new DynamicSearchResult();
    this.dynamicSearchResult.tableName = "";
    this.dynamicSearchResult.query = "SELECT Employee.EmployeeNo,Employee.Name FROM Employee WHERE Employee.DOL IS NULL AND Employee.OrganizationId=1 AND Employee.EmployeeNo NOT IN(SELECT GlobalGroupEmployees.EmployeeNo FROM GlobalGroupEmployees WHERE GlobalGroupEmployees.GlobalGroupId=10000) ORDER BY Employee.Name";
    this.MprService.getDBMastersList(this.dynamicSearchResult).subscribe(data => {
      this.employee = data;

    });
  }
  ShowAddDialog() {
    this.AddDialog = true;
    this.PMAddForm.reset();//To reset the values entered previously
    this.AddSubmitted = false;//Removes the Validation error when attempted to click the Add button
    this.loadEmployees();
   // this.PMAddForm.EmployeeNo = "0";
  }

  Cancel() {
    this.AddDialog = false;
  }

  //onApproverRowDelete(employee: Employee) {
  //  this.dynamicSearchResult.query = "UPDATE MPRApprovers SET BoolActive=0 WHERE MPRApprovers.EmployeeNo='" + employee.EmployeeNo + "'";
  //  this.MprService.updateDataToDBMasters(this.dynamicSearchResult).subscribe(data => this.approvers = data);
  //  this.loadApprovers();
  //}

  InsertPM() {
    this.AddSubmitted = true;
    if (this.PMAddForm.invalid) {
      return
    }
    else {
      this.addPM(this.PMAddForm.value)
      this.AddDialog = false;
      this.loadProjectManagers();
    }
  }
  addPM(PMData: ProjectManager) {
    this.dynamicSearchResult.tableName = "GlobalGroupEmployees";
    this.dynamicSearchResult.columnNames = "GlobalGroupId,EmployeeNo";
    this.dynamicSearchResult.columnValues = "10000," + PMData.EmployeeNo
    this.MprService.addDataToDBMasters(this.dynamicSearchResult).subscribe(
      () => {
        this.dataSaved = true;
        this.loadProjectManagers();
        this.PMAddForm.reset();
      });
  }
}
