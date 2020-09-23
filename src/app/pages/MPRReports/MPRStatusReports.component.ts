import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MessageService } from 'primeng/api';
import { statussearch, PADetailsModel, ReportInputModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, padeletemodel } from 'src/app/Models/PurchaseAuthorization'


@Component({
    selector: 'app-MPRStatusReports',
    templateUrl: './MPRStatusReports.component.html',
})

export class MPRStatusReportsComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router, public messageService: MessageService, public formbuilder: FormBuilder, private routing: Router) { }

  public employee: Employee;
  public paid: number;
  public pofilters: PADetailsModel;
  public buyergroups: Array<any> = [];
  public statuslist: any[];
  public purchasedetails: mprpadetailsmodel;
  public DeleteDialog: boolean;
    public reportinput: ReportInputModel;
    public search: statussearch;
    public departmentlist: any[];
    Completed: any;
    Pending: any;
    Submitted: any;

  filteredoptions: Observable<any[]>;
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.purchasedetails = new mprpadetailsmodel();
    this.buyergroups = new Array<any>();
    this.pofilters = new PADetailsModel();
    this.DeleteDialog = false;
    this.departmentlist = new Array<any>();
    this.loadbuyergroups();
    this.reportinput = new ReportInputModel();
    this.statuslist = new Array<any>();
    this.search = new statussearch();
      this.GetMprstatusreport(this.reportinput);
      this.loadallmprdepartments();
  }

  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
        this.buyergroups = data;
    })
  }
    GetMprstatusreport(status: ReportInputModel) {
        this.paService.Getmprstatus(status).subscribe(data => {
            this.statuslist = data['Table'];
            console.log("this.statuslist", this.statuslist)
            this.Completed = this.statuslist.map(res => res.Completed).reduce((sum, current) => sum + current);
            this.Pending = this.statuslist.map(res => res.Pending).reduce((sum, current) => sum + current);
            this.Submitted = this.statuslist.map(res => res.submitted).reduce((sum, current) => sum + current);
            console.log("this.data1", this.Submitted)
        })
    }
    displymprstatus(name?: string, data?: number, dept?: any) {
        this.search.totalcount = data;
        this.search.status = name;
        this.search.DepartmentId = dept['DepartmentId'];
        localStorage.setItem("statusDetails", JSON.stringify(this.search));
        this.routing.navigateByUrl("/SCM/requisitionreport");
    }
    loadallmprdepartments() {
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
        });
    }
}
