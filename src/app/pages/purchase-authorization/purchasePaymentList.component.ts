import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import 'rxjs/add/observable/of';
import { MessageService } from 'primeng/api';
import { PADetailsModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, padeletemodel } from 'src/app/Models/PurchaseAuthorization'


@Component({
  selector: 'app-purchasePaymentList',
  templateUrl: './purchasePaymentList.component.html',
})

export class purchasePaymentListComponent implements OnInit {

  constructor(private paService: purchaseauthorizationservice, private router: Router, public messageService: MessageService, public formbuilder: FormBuilder) { }
  public purchasemodes: mprpapurchasemodesmodel[];
  public purchasetypes: mprpapurchasetypesmodel[];
  public employee: Employee;
  public paid: number;
  public palist: any;
  public pofilters: PADetailsModel;
  public buyergroups: Array<any> = [];
  public Vendors: Array<any> = [];
  public departmentlist: Array<any> = [];
  public Approvers: Array<any> = [];
  public purchasedetails: mprpadetailsmodel;
  public filtereddepartments: any;
  public filteredvendors: any;
  public brand: string;
  public DeleteDialog: boolean;
  public padelete: padeletemodel;
  public PADeleteForm: FormGroup;
    public editable: boolean;
    public approverselect: boolean;
  mycontrol = new FormControl();
  vendorcontrol = new FormControl();
  buyercontrol = new FormControl();
  filteredoptions: Observable<any[]>;
    ngOnInit() {
        this.departmentlist = new Array<any>();
        this.loadallmprdepartments();
        this.pofilters = new PADetailsModel();
        if (localStorage.getItem("Employee")) {
        this.employee = JSON.parse(localStorage.getItem("Employee"));
            if (this.employee.OrgDepartmentId != 14) {
            this.pofilters.OrgDepartmentId = this.employee.OrgDepartmentId;
            this.editable = true;
           // let index2 = this.departmentlist.filter(li => li[0]['ORgDepartmentid'] == this.employee.OrgDepartmentId);
            
            //var index2 = this.departmentlist.filter(li => li.OrgDepartmentId === this.employee.OrgDepartmentId);
            //for (var i = 0; i < this.departmentlist.length; i++) {
            //    let index1 = this.departmentlist[i]['ORgDepartmentid'] === this.employee.OrgDepartmentId
            //    console.log("index1", index1)
            //}
        }
    }
    else {
      this.router.navigateByUrl("Login");
      }
    this.purchasemodes = new Array<mprpapurchasemodesmodel>();
    this.purchasetypes = new Array<mprpapurchasetypesmodel>();
    this.purchasedetails = new mprpadetailsmodel();
    this.buyergroups = new Array<any>();
    this.palist = new Array<any>();
   
    this.DeleteDialog = false;
    //this.loadAllmprpalist();
    this.loadbuyergroups();
    this.padelete = new padeletemodel();
    this.loadAllVendor();
    //this.filtereddepartments = [];

        this.approverselect = true;

    //this.filteredoptions = this.mycontrol.valueChanges.pipe(startWith(''),
    //    map(value => this._filter(value))
    //);
    this.PADeleteForm = this.formbuilder.group({
      Remarks: ['', [Validators.required]]
    })
  }

  loadAllVendor() {
    this.paService.LoadAllVendors().subscribe(data => {
      this.Vendors = data
      //this.filteredvendors = this.filterVendors('');
    })
  }

  onKeyUp(e): void {
    this.filtereddepartments = this.filterStates(e.target.value);
  }
  toggleModal(e) {
    this.brand = e.target.value;
  }

  filterStates(val: string): Observable<any> {
    let arr: any[];
    console.log(val)
    if (val) {
      arr = this.departmentlist.filter(s => new RegExp(`^${val}`, 'gi').test(s.Department));
    } else {
      arr = this.departmentlist;
    }
    return Observable.of(arr);
  }
  loadallmprdepartments() {
    this.paService.LoadAllDepartments().subscribe(data => {
        this.departmentlist = data;
        var index2 = this.departmentlist.filter(li => li['ORgDepartmentid'] === this.employee.OrgDepartmentId);
        var departmentid=0
        if (this.employee.OrgDepartmentId != 14) {
             departmentid = index2[0].DepartmentId;
        }
        this.GETApprovernamesbydepartmentid(departmentid)
    });
    }
    GETApprovernamesbydepartmentid(departmentid: number) {
        this.paService.GETApprovernamesbydepartmentid(departmentid).subscribe(data => {
            this.Approvers = data;
        });
    }

  GetMprpadetailsBySearch(pofilters: PADetailsModel) {
    this.paService.GetMprpadetailsBySearch(pofilters).subscribe(data => {
      this.palist = data;
    });
  }
  //displayfn(department: object) {
  //    return department ? (department['Department']) : undefined;
  //    //this.GetMprpadetailsBySearch(department['DepartmentId']);

  //}
  displayfn(option) {
    //I want to get the full object and display the name
    if (!option) return '';
    return option.Department;

    //let index = this.departmentlist.find(state => state.DepartmentId === DepartmentId);
    //return this.departmentlist[index].name;
  }
  returnFn(option): number | undefined {
    return option ? option.DepartmentId : undefined;
  }
  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
      this.buyergroups = data;

    })
  }
  dispose(): void {
    this.departmentlist = null;
  }
  displayfn1(option) {
    // I want to get the full object and display the name
    if (!option) return '';
    return option.VendorName;
  }
  onKeyUp1(e): void {
    this.filteredvendors = this.filterVendors(e.target.value);
  }
  filterVendors(val: string): Observable<any> {
    let arr: any[];
    console.log(val)
    if (val) {
      arr = this.Vendors.filter(s => new RegExp(`^${val}`, 'gi').test(s.VendorName));
    } else {
      arr = this.Vendors;
    }

    // Simulates request
    return Observable.of(arr);
  }
  displayfn2(option) {
    // I want to get the full object and display the name
    if (!option) return '';
    return option.BuyerGroup;
  }
  deletepa(padelete: padeletemodel) {
    this.DeleteDialog = true;
    this.paid = padelete.PAId
  }
  finaldelete(padelete: padeletemodel) {
    this.DeleteDialog = false;
    padelete.PAId = this.paid;
    padelete.employeeno = this.employee.EmployeeNo;
    this.paService.Deletepa(padelete).subscribe(data => {
      this.paid = data;
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'PA Deleted Successfully' });
      this.GetMprpadetailsBySearch(this.pofilters);
    })

  }
  Cancel() {
    this.DeleteDialog = false;
  }

  //redirect to tokuchu request
  createTokuchuRequest(details: any) {
    localStorage.setItem("paid", details.PAId);
    if (details.TokuchRequestid)
      this.router.navigate(["/SCM/TokochuRequest", details.TokuchRequestid]);
    else
      this.router.navigateByUrl("/SCM/TokochuRequest");
    }
    someFunction(e) {
        this.approverselect = false;
        console.log("akil",e)
    }
}
