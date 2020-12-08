import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { statussearch, PADetailsModel, ReportInputModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, padeletemodel } from 'src/app/Models/PurchaseAuthorization'
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-MPRStatusReports',
    templateUrl: './MPRStatusReports.component.html',
    providers: [DatePipe]
})

export class MPRStatusReportsComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private datePipe: DatePipe, private spinner: NgxSpinnerService,private router: Router, public messageService: MessageService, public formbuilder: FormBuilder, private routing: Router) { }

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
    public currentDate: Date;
    filteredoptions: Observable<any[]>;
    public editable: boolean;
    ngOnInit() {
        this.reportinput = new ReportInputModel();
        this.pofilters = new PADetailsModel();
        this.loadallmprdepartments();
    if (localStorage.getItem("Employee")) {
        this.employee = JSON.parse(localStorage.getItem("Employee"));
        console.log("this.employee ", this.employee )
        if (this.employee.OrgDepartmentId != 14) {
            this.reportinput.OrgDepartmentId = this.employee.OrgDepartmentId;
            this.editable = true;
        }
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.purchasedetails = new mprpadetailsmodel();
    this.buyergroups = new Array<any>();
    this.DeleteDialog = false;
    this.departmentlist = new Array<any>();
    this.loadbuyergroups();
   
    this.statuslist = new Array<any>();
        this.search = new statussearch();
        //this.reportinput.Fromdate = this.datePipe.transform("01" + '-' + new Date().getMonth().toString() + '-' + new Date().getFullYear().toString(), "yyyy-mm-dd");
        this.reportinput.Fromdate = "2020-12-01";
        this.reportinput.Todate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.GetMprstatusreport(this.reportinput);
      
     
  }

  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
        this.buyergroups = data;
    })
  }
    GetMprstatusreport(status: ReportInputModel) {
        this.spinner.show();
        this.paService.Getmprstatus(status).subscribe(data => {
            this.spinner.hide();
            this.statuslist = data['Table'];
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
        this.search.BuyerGroupId = this.reportinput.BuyerGroupId;
        this.search.Fromdate = this.reportinput.Fromdate;
        this.search.Todate = this.reportinput.Todate;
        this.search.Issuepurposeid = this.reportinput.Issuepurposeid;
        this.search.OrgDepartmentId = this.reportinput.OrgDepartmentId;
        localStorage.setItem("statusDetails", JSON.stringify(this.search));
        // this.routing.navigateByUrl("/SCM/requisitionreport",'_blank');
        window.open("/SCM/requisitionreport", '_blank')
    }
    loadallmprdepartments() {
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
        });
    }
}
