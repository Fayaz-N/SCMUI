import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import 'rxjs/add/observable/of';
import { PADetailsModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, PAAuthorizationLimitModel} from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-AddSlabs',
    templateUrl: './AddSlabs.component.html',
})
export class AddSlabsComponent implements OnInit {
    
    constructor(private paService: purchaseauthorizationservice, private router: Router, private formBuilder: FormBuilder) { }
    public detailsform: FormGroup;
    public paauthorization: PAAuthorizationLimitModel;
    public paSubmitted: boolean = false;
    public employee: Employee;
    public authid: number;
    public palist: any;
    public pofilters: PADetailsModel;
    public buyergroups: Array<any> = [];
    public Vendors: Array<any> = [];
    public departmentlist: any[];
    public filtereddepartments: any;
    public mappedslab: Array<any> = [];
    public filteredvendors: any;
    public brand: string;

    mycontrol = new FormControl();
    filteredoptions: Observable<any[]>;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }
        this.detailsform = this.formBuilder.group({
            DeptId: ['', [Validators.required]],
            MinPAValue: ['', [Validators.required]],
            MaxPAValue: ['', [Validators.required]],
            AuthorizationType: ['', [Validators.required]]
        })
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            //this.SelectedDepartment = 0;
        });
        this.paauthorization = new PAAuthorizationLimitModel();
        this.loadmappedslab();
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
                this.loadmappedslab();
               // this.AddDialog = false;
            })
        }
    }
    loadmappedslab() {
        this.paService.LoadAllMappedSlabs().subscribe(data => {
            this.mappedslab = data;
        })
    }
    reset() {

        this.detailsform.controls['DeptId'].clearValidators();
        this.detailsform.controls['MinPAValue'].clearValidators();
        this.detailsform.controls['MaxPAValue'].clearValidators();
        this.detailsform.controls['AuthorizationType'].clearValidators();
        this.detailsform.reset();
    }
    deletePurchaserow(mappingdata: any) {
        this.paService.RemoveMappedSlab(mappingdata).subscribe(data => {
            this.authid = data;
            this.loadmappedslab();
        })
    }
}
