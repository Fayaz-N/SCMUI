import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MprService } from 'src/app/services/mpr.service';
import { Router } from '@angular/router';
import { Employee, DynamicSearchResult } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, private router: Router, public constants: constants) { }

  public LoginForm: FormGroup;
  public employee: Employee;
  public LoginSubmitted: boolean = false;
  public dynamicData = new DynamicSearchResult();
  public dataSaved: boolean = false;

  ngOnInit() {

    //this.employee = new Employees();
    localStorage.removeItem('Employee');
    localStorage.removeItem('currentUser');
    //localStorage.removeItem('EmployeeList');
    this.LoginForm = this.formBuilder.group({
      DomainId: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });
  }

  Login() {
    console.log(this.LoginForm.value);
    this.LoginSubmitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    else {
      const loginDetails = this.LoginForm.value;
      this.dynamicData.tableName = "Employee";
      this.dynamicData.columnValues = loginDetails.DomainId + "," + loginDetails.Password;
      this.dynamicData.searchCondition = "DomainId='" + loginDetails.DomainId + "'";
      this.MprService.ValidateLoginCredentials(this.dynamicData).subscribe(data => {
        if (data == true) {
          this.MprService.GetListItems(this.dynamicData)
          .pipe(first())
          .subscribe(data => {
            this.employee = data;
            console.log(this.employee);
            localStorage.setItem("Employee", JSON.stringify(this.employee));
            this.LoginForm.reset();
            this.router.navigateByUrl('SCM/Dashboard');
          });
        }
        else {
          window.alert("Invalid Domain Id & Password");
          return;
        }
      });
    }
  }
}
