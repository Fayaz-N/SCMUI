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
  public departmentlist: any[];
  public purchasedetails: mprpadetailsmodel;
  public filtereddepartments: any;
  public filteredvendors: any;
  public brand: string;
  public DeleteDialog: boolean;
  public padelete: padeletemodel;
  public PADeleteForm: FormGroup;

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
    this.purchasemodes = new Array<mprpapurchasemodesmodel>();
    this.purchasetypes = new Array<mprpapurchasetypesmodel>();
    this.purchasedetails = new mprpadetailsmodel();
    this.buyergroups = new Array<any>();
    this.palist = new Array<any>();
    this.pofilters = new PADetailsModel();
    this.DeleteDialog = false;
    //this.loadAllmprpalist();
    this.loadbuyergroups();
    this.padelete = new padeletemodel();
    this.loadAllVendor();
    //this.filtereddepartments = [];

    this.departmentlist = new Array<any>();
    this.loadallmprdepartments();
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
      //this.filtereddepartments = this.filterStates('');
    });
  }


  GetMprpadetailsBySearch(pofilters: PADetailsModel) {
    this.paService.GetMprpadetailsBySearch(pofilters).subscribe(data => {
      this.palist = data;
        console.log("palist", this.palist)
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
}
