import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { PADetailsModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel} from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-purchasePaymentList',
  templateUrl: './purchasePaymentList.component.html',
})
export class purchasePaymentListComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router) { }
    public purchasemodes: mprpapurchasemodesmodel[];
    public purchasetypes: mprpapurchasetypesmodel[];
    public employee: Employee;
    public paid: number;
    public palist: any;
    public buyergroups: any[];
    public departmentlist: any[];
    public purchasedetails: mprpadetailsmodel;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }
        this.purchasemodes = new Array<mprpapurchasemodesmodel>();
        this.purchasetypes = new Array<mprpapurchasetypesmodel>();
        this.purchasedetails = new mprpadetailsmodel();
        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.loadAllmprpalist();
    }


    loadAllmprpalist() {
        this.paService.LoadMprPAList().subscribe(data => {
            this.palist = data;
        })
    }



}
