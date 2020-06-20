import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { PADetailsModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, PAApproverDetailsInputModel, mprpapurchasemodesmodel, mprpadetailsmodel} from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-MPRPAApproversList',
    templateUrl: './MPRPAApproversList.component.html',
})
export class MPRPAApproversListComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router) { }

    public employee: Employee;
    public approverslist: Array<any>[];
    public paid: number;
    public palist: any;
    public buyergroups: any[];
    public departmentlist: any[];
    public paapproverdeatils: Array<any>[];
    public purchasedetails: mprpadetailsmodel;
    public inputsearch: PAApproverDetailsInputModel;
    public Vendors: Array<any> = [];
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }
        
        this.purchasedetails = new mprpadetailsmodel();
        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.loadAllmprpaapproverslist();
        this.approverslist = new Array<any>();
        this.paapproverdeatils = new Array<any>();
        this.inputsearch = new PAApproverDetailsInputModel();
        this.loadbuyergroups();
        this.loadAllVendor();
        this.loadallmprdepartments();
        this.LoadmprApproverDetailsbySearch(this.inputsearch);
        this.departmentlist = new Array<any>();
        this.buyergroups = new Array<any>();
        this.Vendors = new Array<any>();
    }

    loadAllVendor() {
        this.paService.LoadAllVendors().subscribe(data => {
            this.Vendors = data
            //this.filteredvendors = this.filterVendors('');
        })
    }
    loadbuyergroups() {
        this.paService.LoadAllmprBuyerGroups().subscribe(data => {
            this.buyergroups = data;

        })
    }
    loadAllmprpaapproverslist() {
        this.paService.loadAllmprpaapproverslist().subscribe(data => {
            this.approverslist = data;
        })
       
    }
    loadallmprdepartments() {
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            //this.filtereddepartments = this.filterStates('');
        });
    }

    LoadmprApproverDetailsbySearch(inpusearch: PAApproverDetailsInputModel) {
        inpusearch.CreatedBy = this.employee.EmployeeNo;
        this.paService.LoadmprApproverDetailsbySearch(inpusearch).subscribe(data => {
            this.paapproverdeatils = data;
        })
    }
}
