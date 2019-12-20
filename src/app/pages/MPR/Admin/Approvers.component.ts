import { Component, OnInit } from '@angular/core'
import { MPRApprovers, DynamicSearchResult, Employee } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-Approvers',
  templateUrl:'./Approvers.component.html'

})

export class ApproversComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,public MprService: MprService, public constants: constants) { }
  public ApproverAddForm: FormGroup;
  public approvers: MPRApprovers;
  public dynamicSearchResult: DynamicSearchResult;
  public employee: Array<Employee> = [];
  public EmpModel: Employee
  public AddDialog: boolean;
  public AddSubmitted: boolean = false;
  public selectedApprover: Employee;
  public approverDefaultValue: Number;
  public dataSaved: boolean;

  ngOnInit()
  {
    this.approvers = new MPRApprovers();
    this.dynamicSearchResult = new DynamicSearchResult();
    this.EmpModel = new Employee();  
    this.employee = [];
    this.loadApprovers();
    this.approverDefaultValue = 0;
    this.ApproverAddForm = this.formBuilder.group({
      EmployeeNo: ['',[Validators.required]]
    });
    
  }

  loadApprovers() {
    this.dynamicSearchResult.tableName = "MPRApproversView";
    this.dynamicSearchResult.sortBy = "Name";
    this.MprService.getDBMastersList(this.dynamicSearchResult).subscribe(data => this.approvers = data);
  }

  loadEmployees() {
    this.dynamicSearchResult = new DynamicSearchResult();
    this.dynamicSearchResult.query = "SELECT Employee.EmployeeNo,Employee.Name FROM Employee WHERE Employee.DOL IS NULL AND Employee.OrganizationId=1 AND Employee.EmployeeNo NOT IN(SELECT MPRApprovers.EmployeeNo FROM MPRApprovers) ORDER BY Employee.Name";
    this.MprService.getDBMastersList(this.dynamicSearchResult).subscribe(data => {
      this.employee = data;
     
    });
  }
  ShowAddDialog() {
    this.AddDialog = true;
    this.ApproverAddForm.reset();//To reset the values entered previously
    this.AddSubmitted = false;//Removes the Validation error when attempted to click the Add button
    this.loadEmployees();
    this.EmpModel.EmployeeNo = "Select";
  }

  Cancel() {
    this.AddDialog = false;
  }

  onApproverRowDelete(employee:Employee) {
    this.dynamicSearchResult.query = "UPDATE MPRApprovers SET BoolActive=0 WHERE MPRApprovers.EmployeeNo='" + employee.EmployeeNo+"'";
    this.MprService.updateDataToDBMasters(this.dynamicSearchResult).subscribe(data => this.approvers = data);
    this.loadApprovers();
  }

  InsertApprover() {
    this.AddSubmitted=true;
    if (this.ApproverAddForm.invalid) {
      return
    }
    else {
      const approverADValues = this.ApproverAddForm.value;
    //  localStorage.setItem("BuyerGroup", bgAdd.BuyerGroup);
      this.addApprover(approverADValues)
      this.AddDialog = false;
     // this.loadEmployees();
    }
  }
  addApprover(empData: Employee) {
    this.dynamicSearchResult.tableName = "MPRApprovers";
    this.dynamicSearchResult.columnNames = "EmployeeNo";
    this.dynamicSearchResult.columnValues = empData.EmployeeNo;
    this.MprService.addDataToDBMasters(this.dynamicSearchResult).subscribe(
      () => {
        this.dataSaved = true;
        this.loadApprovers();
        this.ApproverAddForm.reset();
      });
  }
}
