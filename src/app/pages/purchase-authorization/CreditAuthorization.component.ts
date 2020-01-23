import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { ConfigurationModel, ChangedModel, DepartmentModel, PAAuthorizationLimitModel, PAAuthorizationEmployeeMappingModel, PACreditDaysMasterModel, PACreditDaysApproverModel } from 'src/app/Models/PurchaseAuthorization'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Employee } from '../../Models/mpr';
@Component({
    selector: 'app-CreditAuthorization',
  templateUrl: './CreditAuthorization.component.html',
})
export class CreditAuthorizationComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }
    public credit: PACreditDaysMasterModel;
    public creditdays: PACreditDaysMasterModel[];
    public authorization: PAAuthorizationLimitModel[];
    public mappedcredit: Array<any> = [];
    public employeeslist = [];
    public employee: Employee;
    public creditdaysid: number;
    public creditform; Approveform: FormGroup;
    public addialog: boolean;
    public approvalid: number;
    public creditApprovers: PACreditDaysApproverModel;
    public crSubmitted: boolean = false;
    public approveSubmitted: boolean = false;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }

        this.credit = new PACreditDaysMasterModel();
        this.creditApprovers = new PACreditDaysApproverModel();
        this.mappedcredit = new Array<any>();
        this.creditform = this.formBuilder.group({
            MinDays: ['', [Validators.required]],
            MaxDays: ['', [Validators.required]]
        })
        this.Approveform = this.formBuilder.group({
            Authid: ['', [Validators.required]],
            EmployeeNo: ['', [Validators.required]],
            CreditDaysid: ['', [Validators.required]]
        })
       
        this.creditdays = new Array<PACreditDaysMasterModel>();
        this.LoadAllCredits();
        this.LoadEmployeeforCreditApproval();
        this.loadallcreditdays();
        this.LoadAllMappedCredits();
        this.Approveform.reset();

    }
    AddCreditMaster() {
        this.addialog = true;
    }
    Submit(credit: PACreditDaysMasterModel) {
        this.crSubmitted = true;
        credit.CreatedBy = this.employee.EmployeeNo;
        if (this.creditform.invalid) {
            return;
        }
        else {
            this.paService.InsertCreditMaster(credit).subscribe(data => {
                this.creditdaysid = data;
                this.ResetForm();
            })
        }
        this.loadallcreditdays()
    }
    Cancel() {
        this.addialog = false;
    }
    ResetForm() {
        this.creditform.controls['MinDays'].clearValidators();
        this.creditform.controls['MaxDays'].clearValidators();
        this.creditform.reset();
    } 
    LoadAllCredits() {
        this.paService.GetAllCredits().subscribe(data => {
            this.authorization = data;
        })
    }
    LoadEmployeeforCreditApproval() {
        this.paService.LoadAllemployees().subscribe(data => {
            this.employeeslist = data;
        })
    }
    loadallcreditdays() {
        debugger;
        this.paService.LoadAllCreditDays().subscribe(data => {
            this.creditdays = data;
        })
    }
    LoadAllMappedCredits() {
        this.paService.LoadAllMappedCredits().subscribe(data => {
            this.mappedcredit = data;
        })
    }
    Approvecredit(creditApprovers: PACreditDaysApproverModel) {
        creditApprovers.Createdby = this.employee.EmployeeNo;
        this.approveSubmitted = true;
        if (this.Approveform.invalid) {
            return;
        }
        else {
            this.paService.InsertCreditApprovers(creditApprovers).subscribe(data => {
                this.approvalid = data;
                this.LoadAllMappedCredits();
                this.ResetApproveForm();
            })
        }
       
    }
    ResetApproveForm() {
        this.Approveform.controls['Authid'].clearValidators();
        this.Approveform.controls['EmployeeNo'].clearValidators();
        this.Approveform.controls['CreditDaysid'].clearValidators();
        this.Approveform.reset();
    }
    deletecreditrow(mappingdata: any) {
        this.paService.RemovePurchaseApprover(mappingdata).subscribe(data => {
            this.creditdaysid = data;
            this.LoadAllMappedCredits();
        })
    }
}
