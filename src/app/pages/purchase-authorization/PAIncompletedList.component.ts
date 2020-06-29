import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { PADetailsModel, ItemsViewModel, EmployeeModel, painutmodel, mprpapurchasetypesmodel, PAReportInputModel, PAApproverDetailsInputModel, mprpapurchasemodesmodel, mprpadetailsmodel, StatusCheckModel } from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-PAIncompletedList',
    templateUrl: './PAIncompletedList.component.html',
})
export class PAIncompletedListComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router) { }

    public employee: Employee;
    public incompletedlist: Array<any>[];
    public paid: number;
    public palist: any;
    public buyergroups: any[];
    public departmentlist: any[];
    public paapproverdeatils: Array<any>[];
    public purchasedetails: mprpadetailsmodel;
    public inputsearch: painutmodel;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }
        this.paid ;
        this.purchasedetails = new mprpadetailsmodel();
        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.incompletedlist = new Array<any>();
        this.paapproverdeatils = new Array<any>();
        this.inputsearch = new painutmodel();
        this.loadAllIncompltedpalist(this.inputsearch)
    }


    loadAllIncompltedpalist(model: painutmodel) {
        this.paService.loadAllIncompltedpalist(model).subscribe(data => {
            this.incompletedlist = data;
        })
    }

    //LoadmprApproverDetailsbySearch(inpusearch: PAApproverDetailsInputModel) {
    //    inpusearch.CreatedBy = this.employee.EmployeeNo;
    //    this.paService.LoadmprApproverDetailsbySearch(inpusearch).subscribe(data => {
    //        this.paapproverdeatils = data;
    //    })
    //}
    //LoadReport(reportsearch: PAReportInputModel) {
    //    this.paService.loadpareport(reportsearch).subscribe(data => {
    //        this.palist = data;
    //    })
    //}
}
