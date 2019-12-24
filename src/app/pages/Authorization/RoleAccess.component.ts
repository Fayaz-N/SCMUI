import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { GroupNameModel, RoleAccessModel } from 'src/app/Models/config.model';
import { ConfigService } from 'src/app/services/config.service';
import { ConfirmationDialogComponent } from 'src/app/common/confirmationdialog/confirmation-dialog.component';
import { Employee } from 'src/app/Models/mpr';

@Component({
  selector: 'app-RoleAccess',
  templateUrl: './RoleAccess.component.html',
  styleUrls: ['./AccessGroup.component.css']
})
export class RoleAccessComponent implements OnInit {
  public emp: Employee;
  groupMasterForm: FormGroup;
  groupNameModel: GroupNameModel[];
  roleAccessModel: RoleAccessModel[];
  newData: boolean;
  submitted = false;
  roleIdUpdate: number = null;
  GroupName: string;
  searchText;

  constructor(private router: Router, private activeroute: ActivatedRoute,
    private formBuilder: FormBuilder, private configService: ConfigService, private _dialog: MatDialog) {
  }

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.emp = JSON.parse(localStorage.getItem("Employee"))[0];
    else
      this.router.navigateByUrl("Login");
    this.groupMasterForm = this.formBuilder.group({
      RoleName: ['', [Validators.required]]
    });
    this.getAllRole();
  }

  onSubmit() {

    const role = this.groupMasterForm.value;
    this.submitted = true;
    if (this.groupMasterForm.invalid) {
      return;
    }
    else {
      this.CreateRoles(role);
      this.groupMasterForm.reset();
    }
  }
  get f() { return this.groupMasterForm.controls; }

  CreateRoles(roleAccessModel: RoleAccessModel) {
    this.submitted = true;
    if (this.roleIdUpdate == null) {
      this.configService.createRoleAccess(roleAccessModel).subscribe(data => {
        alert(data);
        this.getAllRole();
        this.groupMasterForm.reset();
        this.submitted = false;

      }
      );
    }
    else {
      roleAccessModel.RoleId = this.roleIdUpdate;
      this.configService.updateAuthRole(roleAccessModel).subscribe(() => {
        this.roleIdUpdate = null;
        this.getAllRole();
        this.groupMasterForm.reset();
        this.submitted = false;

      });
    }


  }
  onReset() {
    this.submitted = false;
    this.groupMasterForm.reset();
  }
  getAllRole() {
    this.configService.getAllRoleName().subscribe(data => {
      this.roleAccessModel = data;
      console.log(this.roleAccessModel);
    }
    )
  }

  Remove(roleAccessModel: RoleAccessModel) {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: 'Do you confirm the deletion of this data?',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.configService.deleteAuthRole(roleAccessModel).subscribe(res => {
          const status: any = 'success';
          this.getAllRole();
        },
          err => {
            console.log(err);
          });
      }
    });

  }

  getallGroup() {
    //alert("Hello") 
  }


  Edit(roleaccess: RoleAccessModel) {
    this.newData = false;
    this.roleIdUpdate = roleaccess.RoleId;
    this.groupMasterForm.controls['RoleName'].setValue(roleaccess.RoleName);

    //this.displayDialog = true;

  }



}
