import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { GroupMasterModel, GroupMastergetallModel } from 'src/app/Models/config.model';
import { ConfigService } from 'src/app/services/config.service';
import { ConfirmationDialogComponent } from 'src/app/common/confirmationdialog/confirmation-dialog.component';
import { Employee } from 'src/app/Models/mpr';

@Component({
  selector: 'app-Config',
  templateUrl: './Config.component.html',
  styleUrls: ['./AccessGroup.component.css']
})
export class ConfigComponent implements OnInit {
  public em: Employee;
  groupMasterForm: FormGroup;
  groupmastermodel: GroupMasterModel[];
  allmastermodel: GroupMasterModel[];
  deleteGroupModel: GroupMastergetallModel[];
  displayDialog: boolean;
  newData: boolean;
  submitted = false;
  accessGroupIdUpdate: number = null;
  searchText;
  GroupName: string;

  constructor(private router: Router, private activeroute: ActivatedRoute,
    private formBuilder: FormBuilder, private configService: ConfigService, private _dialog: MatDialog) {
  }

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.em = JSON.parse(localStorage.getItem("Employee"))[0];
    else
      this.router.navigateByUrl("Login");
    this.groupMasterForm = this.formBuilder.group({
      GroupName: ['', [Validators.required, Validators.maxLength(10)]],
      AccessGroupId: null
    });
    this.getAllGroupName();
  }

  get f() { return this.groupMasterForm.controls; }
  onFormSubmit() {
    this.submitted = true;
    if (this.accessGroupIdUpdate != null) {
      this.groupMasterForm.controls['AccessGroupId'].setValue(this.accessGroupIdUpdate);
    }
    const groupmaster = this.groupMasterForm.value;
    //localStorage.setItem("GroupName",groupmaster.GroupName);
    if (this.groupMasterForm.invalid) {
      return;
    }
    else {
      this.CreateGroupMaster(groupmaster);
      this.groupMasterForm.reset();
    }

    this.getAllGroupName();

  }

  CreateGroupMaster(groupmaster: GroupMasterModel) {
    this.submitted = true;

    if (this.accessGroupIdUpdate == null) {
      this.configService.createNewGroupMaster(groupmaster).subscribe(data => {
        alert(data);
        this.groupMasterForm.reset();
        this.getAllGroupName();
        this.submitted = false;
      }
      );
    }
    else {
      groupmaster.AccessGroupId = this.accessGroupIdUpdate;
      this.configService.updateGroupMaster(groupmaster).subscribe(() => {
        this.accessGroupIdUpdate = null;
        this.getAllGroupName();
        this.submitted = false;

      });
    }

  }
  onReset() {
    this.submitted = false;
    this.groupMasterForm.reset();
  }
  showDialog() {

    this.displayDialog = true;
    this.newData = true;
  }
  getAllGroupName() {
    this.configService.getAllGroupMaster().subscribe(data => {
      this.allmastermodel = data;
      console.log(this.allmastermodel);
    }
    )
  }

  Remove(groupMastergetallModel: GroupMastergetallModel) {
    debugger
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: 'Do you confirm the deletion of this data?',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.configService.deleteGroupMaster(groupMastergetallModel).subscribe(res => {
          const status: any = 'success';
          this.getAllGroupName();
        },
          err => {
            console.log(err);
          });
      }
    });
  }


  Edit(group: GroupMastergetallModel) {
    this.newData = false;
    this.accessGroupIdUpdate = group.AccessGroupId;
    this.groupMasterForm.controls['GroupName'].setValue(group.GroupName);

    //this.displayDialog = true;

  }

  Cancel() {
    this.displayDialog = false;
  }



}
