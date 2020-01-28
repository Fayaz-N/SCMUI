import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationModel, ChangedModel, DepartmentModel, PAAuthorizationLimitModel, PAAuthorizationEmployeeMappingModel } from 'src/app/Models/PurchaseAuthorization'
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Employee } from '../../Models/mpr';

@Component({
    selector: 'app-purchase-authorization',
    templateUrl: './purchase-authorization.component.html',
})
export class PurchaseAuthorizationComponent implements OnInit {
    public paform; detailsform: FormGroup;
    public employee: Employee;
    public paSubmitted: boolean = false;
    public palimits: boolean = false;
    public configuartion: ConfigurationModel;
    public departments: Array<any> = [];
    public SelectedDepartment;
    public selectedslabslist;
    public selectedemployee;
    public departmentlist: Array<any> = [];
    public authid: number;
    public slbaslist = [];
    public authorizationtype = [];
    public mappedpurchase: Array<any> = [];
    public AddDialog: boolean;
    public paauthorization: PAAuthorizationLimitModel;
    public employemapping: PAAuthorizationEmployeeMappingModel;
    public employeelist = [];
    public RolesList = [];
    public deptid: number;
    public SlabsAddForm: FormGroup;
    LessBudget = "LessBudget";
    MoreBudget = "MoreBudget"
    constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, public paService: purchaseauthorizationservice) { }

    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }
        this.paform = this.formBuilder.group({
            Name: ['', [Validators.required]],
        })
        this.detailsform = this.formBuilder.group({
            DeptId: ['', [Validators.required]],
            MinPAValue: ['', [Validators.required]],
            MaxPAValue: ['', [Validators.required]],
            AuthorizationType: ['', [Validators.required]]
        })
        this.paauthorization = new PAAuthorizationLimitModel();
        this.employemapping = new PAAuthorizationEmployeeMappingModel();
        this.mappedpurchase = new Array<any>();
        this.LoadAllemployess();
        this.LoadAllFunctionalMappings();
        this.LoadEmployeemappedPurchases();
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            this.SelectedDepartment = 0;
        });

    }
    selecteSlabs(event: any) {
        this.deptid = event.target.value;
        this.paService.LoadSlabsByDepartmentID(this.deptid).subscribe(data => {
            debugger;
            this.slbaslist = data;
            this.selectedslabslist = 0;
        })

    }
    LoadAllemployess() {
        this.paService.LoadAllemployees().subscribe(data => {
            this.employeelist = data;
            this.employemapping.Employeeid = "0";

        })
    }
    LoadAllFunctionalMappings() {
        this.paService.LoadAllFunctionalMappings().subscribe(data => {
            this.RolesList = data;
        })
    }
    showDialogAddDepartment() {
        this.AddDialog = true;
    }
   
    Submit(paauthorization: PAAuthorizationLimitModel) {
        paauthorization.CreatedBy = this.employee.EmployeeNo;
        this.paSubmitted = true;
        if (this.detailsform.invalid) {
            return;
        }
        else {
            this.paService.InsertPAAuthorizationLimits(paauthorization).subscribe(data => {
                this.authid = data;
                this.detailsform.clearValidators();
                this.reset();
            })
        }
        //this.detailsform.clearValidators();
        //this.detailsform.reset();
    }
    Cancel() {
        this.AddDialog = false;
    }
    reset() {
        
        this.detailsform.controls['DeptId'].clearValidators();
        this.detailsform.controls['MinPAValue'].clearValidators();
        this.detailsform.controls['MaxPAValue'].clearValidators();
        this.detailsform.controls['AuthorizationType'].clearValidators();
        this.detailsform.reset();
    }

    InsertEmployeeMapping(employemapping: PAAuthorizationEmployeeMappingModel) {
        if (employemapping.FunctionalRoleId) {
            employemapping.CreatedBY = this.employee.EmployeeNo;
            this.paService.InsertEmployeeMapping(employemapping).subscribe(data => {
                this.authid = data;
                this.LoadEmployeemappedPurchases();
            })
        }
        else
            alert("Select Functional Role");
    }
    LoadEmployeemappedPurchases() {
        this.paService.LoadEmployeemappedPurchases().subscribe(data => {
            this.mappedpurchase = data;
        })
    }
    toggle(event): void {
        event.target.classList.toggle("active");
    }
    
    setradio(e) {
        this.employemapping.checked = e.target.checked;
        if (e.target.value === "LessBudget") {
            this.employemapping.LessBudget = true;
            this.employemapping.MoreBudget = false;
        }
        else {
            this.employemapping.LessBudget = false;
            this.employemapping.MoreBudget = true;
        }
    }
    deletePurchaserow(mappingdata: any) {
        this.paService.RemovePurchaseApprover(mappingdata).subscribe(data => {
            this.authid = data;
            this.LoadEmployeemappedPurchases();
        })
    }
}


