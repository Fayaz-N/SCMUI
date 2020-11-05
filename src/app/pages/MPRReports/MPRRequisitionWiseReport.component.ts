import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MessageService } from 'primeng/api';
import { PADetailsModel, ReportInputModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, padeletemodel } from 'src/app/Models/PurchaseAuthorization'
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-MPRRequisitionWiseReport',
    templateUrl: './MPRRequisitionWiseReport.component.html',
})

export class MPRRequisitionWiseReportComponent implements OnInit {
    @ViewChild('TABLE', { static: false }) TABLE: ElementRef;  
    constructor(private paService: purchaseauthorizationservice, private router: Router, private datePipe: DatePipe, public messageService: MessageService, private spinner: NgxSpinnerService, public formbuilder: FormBuilder) { }

  public employee: Employee;
    public paid: number;
    public show: boolean = true;
  public buyergroups: Array<any> = [];
  public statuslist: any[];
  public purchasedetails: mprpadetailsmodel;
    public reportinput: ReportInputModel;
    public departmentlist: any[];
    jobcodestotal: any = [];
    public searchdata: any;
    filteredoptions: Observable<any[]>;
    public filerlist: Array<any> = [];
    public mprprepares: any[];
    public mprcheckedby: any[];
    public mprApprovedby: any[];
    public purposetype: any[];
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.purchasedetails = new mprpadetailsmodel();
    this.buyergroups = new Array<any>();
      this.reportinput = new ReportInputModel();

      if (localStorage.getItem("statusDetails")) {
          this.reportinput = JSON.parse(localStorage.getItem("statusDetails"));
          console.log(" this.reportinput", this.reportinput)
          //this.reportinput.Fromdate = "2020-10-01";
          //this.reportinput.Todate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
          this.GetMprRequisitionreport(this.reportinput);
          localStorage.removeItem("statusDetails");
          this.reportinput.DepartmentId = this.reportinput.DepartmentId;
      }
      else {
          this.reportinput.Fromdate = "2020-11-01";
          this.reportinput.Todate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
          //this.GetMprRequisitionreport(this.reportinput);
      }
      this.mprprepares = new Array<any>();
      this.mprcheckedby = new Array<any>();
      this.mprApprovedby = new Array<any>();
      this.purposetype = new Array<any>();
      this.statuslist = new Array<any>();
      this.filerlist = new Array<any>();
      this.departmentlist = new Array<any>();
      
      this.getmprreportfilters();
      this.loadallmprdepartments();
      this.loadbuyergroups();
      this.searchdata = new Array<any>();
  }

  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
        this.buyergroups = data;
    })
  }
    GetMprRequisitionreport(status: ReportInputModel) {
        this.spinner.show();
        this.paService.GetmprrequisitionReport(status).subscribe(data => {
            this.spinner.hide();
            this.statuslist = data;
        })
    }
    getmprreportfilters() {
        this.paService.getmprreportfilters().subscribe(data => {
            this.filerlist = data;
            console.log("this.filerlist", this.filerlist['jobcode'][0])
            this.mprApprovedby = data['mprApprovedby']
            this.mprprepares = data['mprprepares']
            this.mprcheckedby = data['mprcheckedby']
            this.purposetype = data['purposetype']
            this.jobcodestotal = data['jobcode']
        })
    }
    loadallmprdepartments() {
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            //this.filtereddepartments = this.filterStates('');
        });
    }
    ExportTOExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'requisitionSheet.xlsx');
    }
    toggle() {
        this.show= !this.show;
    }
}
