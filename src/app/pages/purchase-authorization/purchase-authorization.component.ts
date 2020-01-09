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
        debugger;
        this.LoadAllemployess();
        this.LoadAllFunctionalMappings();
        this.paService.LoadAllDepartments().subscribe(data => {
            debugger;
            this.departmentlist = data;
            //this.SelectedDepartment = 0;
        });

    }
    selecteSlabs(event: any) {
        this.deptid = event.target.value;
        debugger;
        this.paService.LoadSlabsByDepartmentID(this.deptid).subscribe(data => {
            debugger;
            this.slbaslist = data;
            this.selectedslabslist = 0;
        })

    }
    LoadAllemployess() {
        debugger;
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
    Cancel() {
        this.AddDialog = false;
    }
    Submit(paauthorization: PAAuthorizationLimitModel) {
        debugger;
        paauthorization.CreatedBy = this.employee[0].EmployeeNo;
        this.paSubmitted = true;
        if (this.detailsform.invalid) {
            return;
        }
        else {
            debugger;
            this.paService.InsertPAAuthorizationLimits(paauthorization).subscribe(data => {
                this.authid = data;
            })
        }
    }

    InsertEmployeeMapping(employemapping: PAAuthorizationEmployeeMappingModel) {
        if (employemapping.FunctionalRoleId) {
            employemapping.CreatedBY = this.employee[0].EmployeeNo;
            this.paService.InsertEmployeeMapping(employemapping).subscribe(data => {
                this.authid = data;
            })
        }
        else
            alert("Select Functional Role");
    }
    toggle(event): void {
        event.target.classList.toggle("active");
    }
    setradio(e) {
        debugger

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

}


