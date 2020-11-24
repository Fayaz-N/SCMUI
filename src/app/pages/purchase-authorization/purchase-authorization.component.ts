import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationModel, ChangedModel, DepartmentModel, PAAuthorizationLimitModel, PAAuthorizationEmployeeMappingModel } from 'src/app/Models/PurchaseAuthorization'
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Employee } from '../../Models/mpr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-purchase-authorization',
    templateUrl: './purchase-authorization.component.html',
})

    //Name of Class: << purchasePaymentComponent >> Author :<< Akhil Kumar reddy >>
//    Date of Creation << 1 - 11 - 2019 >>
//        Purpose : << to generate PA, get PA data >>
//            Review Date:<<>> Reviewed By:<<>>
export class PurchaseAuthorizationComponent implements OnInit {
    public paform; detailsform: FormGroup;
    public employee: Employee;
    public paSubmitted: boolean = false;
    public palimits: boolean = false;
    public configuartion: ConfigurationModel;
    public departments: Array<any> = [];
    public SelectedDepartment;
    public selectedslabslist;
    public selectedemployee;
    public departmentlist: Array<any> = [];
    public authid: number;
    public searchemployee: boolean = false;
    public employeemapping: boolean;
    public slbaslist = [];
    public authorizationtype = [];
    public mappedpurchase: Array<any> = [];
    public mappedslab: Array<any> = [];
    public AddDialog: boolean;
    public paauthorization: PAAuthorizationLimitModel;
    public employemapping: PAAuthorizationEmployeeMappingModel;
    public employeelist: SelectItem[];
    public RolesList = [];
    public deptid: number;
    public SlabsAddForm: FormGroup;
    dropdownSettings = {};
    LessBudget = "LessBudget";
    MoreBudget = "MoreBudget"
    constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, public messageService: MessageService, public paService: purchaseauthorizationservice) { }
    @ViewChild('TABLE', { static: false }) TABLE: ElementRef;  
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }
        this.paform = this.formBuilder.group({
            Name: ['', [Validators.required]],
        })
        this.detailsform = this.formBuilder.group({
            DeptId: ['', [Validators.required]],
            MinPAValue: ['', [Validators.required]],
            MaxPAValue: ['', [Validators.required]],
            AuthorizationType: ['', [Validators.required]]
        })
        this.paauthorization = new PAAuthorizationLimitModel();
        this.employemapping = new PAAuthorizationEmployeeMappingModel();
        this.mappedpurchase = new Array<any>();
        this.LoadAllemployess();
        this.employeemapping = true;
        this.employeelist = new Array<SelectItem>();
        this.LoadAllFunctionalMappings();
        this.LoadEmployeemappedPurchases();
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            this.employemapping.DeptId = "0";
        });
        this.dropdownSettings = {
            singleSelection: true,
            text: "Select Employee",
            textField: 'Name',
            idField: 'EmployeeNo',
            unSelectAllText: 'UnSelect All',
            allowSearchFilter: true,
        };
    }
                //Name of Function: << ExportTOExcel >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : << Exporting the mapped employee to pa slabs to excel sheet>>
    //            Review Date:<<>> Reviewed By:<<>>
    public ExportTOExcel(jsonData: any[]): void {

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        XLSX.writeFile(wb, 'Employeemapping.xlsx');
    }
    onItemSelect(item: any) {
        console.log('onItemSelect', item);
    }
    //Name of Function: << selecteSlabs >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : <<getting the pa slabs by department>>
    //            Review Date:<<>> Reviewed By:<<>>
    selecteSlabs(event: any) {
        this.deptid = event.target.value;
        this.paService.LoadSlabsByDepartmentID(this.deptid).subscribe(data => {
            this.slbaslist = data;
            this.employemapping.Authid = 0;
            console.log("this.slbaslist", this.slbaslist)
            //this.selectedslabslist = 0;
        })

    }
    //Name of Function: << LoadAllemployess >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : <<Loading All employees>>
    //            Review Date:<<>> Reviewed By:<<>>
    LoadAllemployess() {
        this.paService.LoadAllemployees().subscribe(data => {
            this.employeelist = data;
            this.employemapping.Employeeid = "0";

        })
    }
    LoadAllFunctionalMappings() {
        this.paService.LoadAllFunctionalMappings().subscribe(data => {
            this.RolesList = data;
        })
    }
    showDialogAddDepartment() {
        this.AddDialog = true;
    }
       //Name of Function: << Submit >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : <<Inserting purchase authorization limits assigned to  employee>>
    //            Review Date:<<>> Reviewed By:<<>>
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
                this.AddDialog = false;
            })
        }
        //this.detailsform.clearValidators();
        //this.detailsform.reset();
    }
    loadmappedslab() {
        this.paService.LoadAllMappedSlabs().subscribe(data => {
            this.mappedslab = data;
        })
    }
    Cancel() {
        this.AddDialog = false;
    }
    //Name of Function: << reset >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : <<Reset the values in text box after submit>>
    //            Review Date:<<>> Reviewed By:<<>>
    reset() {
        
        this.detailsform.controls['DeptId'].clearValidators();
        this.detailsform.controls['MinPAValue'].clearValidators();
        this.detailsform.controls['MaxPAValue'].clearValidators();
        this.detailsform.controls['AuthorizationType'].clearValidators();
        this.detailsform.reset();
    }
        //Name of Function: << InsertEmployeeMapping >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : <<Inserting the Assigned employee to pa limits >>
    //            Review Date:<<>> Reviewed By:<<>>
    InsertEmployeeMapping(employemapping: PAAuthorizationEmployeeMappingModel) {
        if (employemapping.FunctionalRoleId) {
            employemapping.CreatedBY = this.employee.EmployeeNo;
            this.paService.InsertEmployeeMapping(employemapping).subscribe(data => {
                this.authid = data;
                this.employemapping = new PAAuthorizationEmployeeMappingModel();
                this.LoadEmployeemappedPurchases();
                this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Inserted Successfully' });
                
            })
        }
        else
            alert("Select Functional Role");
    }
    LoadEmployeemappedPurchases() { 
        this.paService.LoadEmployeemappedPurchases().subscribe(data => {
            this.mappedpurchase = data;
        })
    }
            //Name of Function: << LoadEmployeemappedPurchasesByDeptid >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : <<loading mapped employee by department id >>
    //            Review Date:<<>> Reviewed By:<<>>
    LoadEmployeemappedPurchasesByDeptid(mapping: any) { 
        this.paService.LoadEmployeemappedPurchasesBydeptid(mapping).subscribe(data => {
            this.mappedpurchase = data;
            this.searchemployee = true;
            this.employeemapping = false;
        })
    }
    toggle(event): void {
        event.target.classList.toggle("active");
    }
         //Name of Function: << setradio >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : <<Radio buttons for selecting lessbudget or morbudget>>
    //            Review Date:<<>> Reviewed By:<<>>
    setradio(e) {
        this.employemapping.checked = e.target.checked;
        if (e.target.value === "LessBudget") {
            this.employemapping.LessBudget = true;
            this.employemapping.MoreBudget = false;
        }
        else {
            this.employemapping.LessBudget = false;
            this.employemapping.MoreBudget = true;
        }
    }
     //Name of Function: << deletePurchaserow >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : <<Deleting Mapped employee to department>>
    //            Review Date:<<>> Reviewed By:<<>>
    deletePurchaserow(mappingdata: any) {
        this.paService.RemovePurchaseApprover(mappingdata).subscribe(data => {
            this.authid = data;
            this.LoadEmployeemappedPurchases();
        })
    }
}


