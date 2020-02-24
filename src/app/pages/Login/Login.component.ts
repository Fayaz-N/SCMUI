import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MprService } from 'src/app/services/mpr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee, DynamicSearchResult, AccessList } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { first } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { MENU_ITEMS } from '../pages-menu';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, private route: ActivatedRoute, private router: Router, public constants: constants, private messageService: MessageService, private spinner: NgxSpinnerService) { }

  public LoginForm: FormGroup;
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public LoginSubmitted: boolean = false;
  public dynamicData = new DynamicSearchResult();
  public dataSaved: boolean = false;
  public returnUrl: string

  ngOnInit() {

    //this.employee = new Employees();
    localStorage.removeItem('Employee');
    //localStorage.removeItem('currentUser');
    //localStorage.removeItem('EmployeeList');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.LoginForm = this.formBuilder.group({
      DomainId: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });
  }

  Login() {
    this.LoginSubmitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    else {
      this.spinner.show();
      const loginDetails = this.LoginForm.value;
      this.dynamicData.tableName = "Employee";
      this.dynamicData.columnValues = loginDetails.DomainId + "," + loginDetails.Password;
      this.dynamicData.searchCondition = "DomainId='" + loginDetails.DomainId + "'";
      //this.MprService.getAuth_token(loginDetails).subscribe(data => {
      //  localStorage.setItem('AccessToken', JSON.stringify(data));

        this.MprService.ValidateLoginCredentials(this.dynamicData)
          .pipe(first())
          .subscribe(data1 => {
            this.spinner.hide();
            if (data1.EmployeeNo != null) {
              this.employee = data1;

              this.MprService.getAccessList(this.employee.RoleId).subscribe(data => {
                localStorage.setItem("AccessList", JSON.stringify(data));
                this.AccessList = data;

                if (this.AccessList.filter(li => li.AccessName == "CreateMPR").length <= 0) {
                  var index = MENU_ITEMS[1].children.findIndex(li => li.title == "MPR Form");
                  MENU_ITEMS[1].children.splice(index, 1);
                }
                if (this.employee.OrgDepartmentId != 14)//cmm users
                {
                  MENU_ITEMS[2].hidden = true;
                  MENU_ITEMS[3].hidden = true;
                  MENU_ITEMS[4].hidden = true;
                  MENU_ITEMS[5].hidden = true;
                }
                else {
                  MENU_ITEMS[2].hidden = false;
                  MENU_ITEMS[3].hidden = false;
                  MENU_ITEMS[4].hidden = false;
                  MENU_ITEMS[5].hidden = false;
                }
              })

              this.LoginForm.reset();
              if (this.returnUrl)
                this.router.navigateByUrl(this.returnUrl);
              else
                this.router.navigateByUrl('/SCM/MPRList');
              //this.router.navigateByUrl('/SCM/Dashboard');

            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Invalid Domain Id & Password' });
              return;
            }
          });
      //})
    }

  }
}
