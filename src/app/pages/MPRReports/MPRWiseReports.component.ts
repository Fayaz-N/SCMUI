import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';  
import { PADetailsModel, ReportInputModel,ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, padeletemodel } from 'src/app/Models/PurchaseAuthorization'


@Component({
    selector: 'app-MPRWiseReports',
    templateUrl: './MPRWiseReports.component.html',
})

export class MPRWiseReportsComponent implements OnInit {
    @ViewChild('TABLE', { static: false }) TABLE: ElementRef;  
  constructor(private paService: purchaseauthorizationservice, private router: Router, public messageService: MessageService, public formbuilder: FormBuilder) { }

  public employee: Employee;
  public paid: number;
  public palist: any;
  public pofilters: PADetailsModel;
  public buyergroups: Array<any> = [];
  public Vendors: Array<any> = [];
  public statuslist: any[];
  public purchasedetails: mprpadetailsmodel;
  public filtereddepartments: any;
  public filteredvendors: any;
  public brand: string;
  public DeleteDialog: boolean;
  public padelete: padeletemodel;
    public PADeleteForm: FormGroup;
    public report: ReportInputModel;

  mycontrol = new FormControl();
  vendorcontrol = new FormControl();
  buyercontrol = new FormControl();
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
    this.palist = new Array<any>();
    this.pofilters = new PADetailsModel();
    this.DeleteDialog = false;
    //this.loadAllmprpalist();
    this.loadbuyergroups();
      this.padelete = new padeletemodel();
      this.report = new ReportInputModel();

      this.statuslist = new Array<any>();

      this.GetMprWisestatusreport(this.report);
  }
    ExportTOExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'ScoreSheet.xlsx');
    }  
  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
      this.buyergroups = data;
    })
    }
    GetMprWisestatusreport(report: ReportInputModel) {
        this.paService.Getmprstatuswise(report).subscribe(data => {
            this.statuslist = data['Table'];
        })
    }
  
}
