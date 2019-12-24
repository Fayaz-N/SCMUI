import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { toUnicode } from 'punycode';
import { ConfirmationService } from 'primeng/api';
import { MatDialog } from '@angular/material';
import { GroupNameModel, AccessNameModel, AccessNameModelNew } from 'src/app/Models/config.model';
import { ConfigService } from 'src/app/services/config.service';
import { ConfirmationDialogComponent } from 'src/app/common/confirmationdialog/confirmation-dialog.component';
import { Employee } from 'src/app/Models/mpr';

@Component({
  selector: 'app-AccessGroup',
  templateUrl: './AccessGroup.component.html',
  styleUrls: ['./AccessGroup.component.css']
})
export class AccessGroupComponent implements OnInit {
  public employee: Employee;
  groupAccessForm: FormGroup;
  selectedGroup: any = '';
  name = '';
  groupNameModel: GroupNameModel[];
  accessNameData: AccessNameModel[];
  groupId: number = 0;
  GroupName: string;
  displayDialog: boolean;
  searchText;
  groupdiv: boolean = false;
  accessNameIdUpdate: number = 0;
  submitted = false;

  constructor(private router: Router, private activeroute: ActivatedRoute, private _dialog: MatDialog,
    private formBuilder: FormBuilder, private configService: ConfigService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"))[0];
    else
      this.router.navigateByUrl("Login");
    //localStorage.clear();
    this.groupAccessForm = this.formBuilder.group({
      GroupName: [''],
      AccessName: ['', [Validators.required]],
      AccessGroupId: [0],
      AccessNameId: 0
    });
    this.getAllGroupName();
    this.groupdiv = false;
  }

  addNewAccess() {
    debugger;

    // this.displayDialog=true;
    this.groupAccessForm.controls['AccessGroupId'].setValue(this.groupId);
    const groupAccess = this.groupAccessForm.value;
    this.submitted = true;
    //localStorage.setItem("AccessName",groupAccess.AccessName);
    if (this.groupAccessForm.invalid) {
      return;
    }
    else {
      this.CreateAccessName(groupAccess);
      this.groupAccessForm.reset();
    }
    //this.getAllGroupName();  


  }
  onReset() {
    this.submitted = false;
    this.groupAccessForm.reset();
  }
  get f() { return this.groupAccessForm.controls; }
  CreateAccessName(accessNameModel: AccessNameModelNew) {
    if (this.accessNameIdUpdate == 0) {

      this.configService.createAccessName(accessNameModel).subscribe(data => {
        alert(data);
        this.groupId = accessNameModel.AccessGroupId;
        this.groupAccessForm.reset();
        this.getAccessNameByGroupId(this.groupId);
        this.submitted = false;
      }
      );
    }
    else {
      accessNameModel.AccessNameID = this.accessNameIdUpdate;
      this.configService.updateAccessName(accessNameModel).subscribe(() => {
        //alert(data);
        this.accessNameIdUpdate = 0;
        this.groupId = accessNameModel.AccessGroupId;
        this.groupAccessForm.reset();
        this.getAccessNameByGroupId(this.groupId);
        this.submitted = false;

      }
      );

    }

  }

  getAllGroupName() {
    this.configService.getAllGroupName().subscribe(data => {
      this.groupNameModel = data;
      console.log(this.groupNameModel);
    }
    )
  }

  getAccessNameByGroupId(accessGroupId: number) {
    this.configService.getAccessNamebyGroupId(accessGroupId).subscribe(data => {
      this.accessNameData = data;
      // this.groupId = 0;


    }

    )
  }


  onSelectName({ AccessGroupId, GroupName }): void {
    this.name = GroupName;
    this.getAccessNameByGroupId(AccessGroupId);
    this.groupId = AccessGroupId;
    this.groupdiv = true;
  }



  Remove(accessNameModel: AccessNameModel) {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: 'Do you confirm the deletion of this data?',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.configService.deleteAccessName(accessNameModel).subscribe(res => {
          const status: any = 'success';
          this.getAccessNameByGroupId(this.groupId)
        },
          err => {
            console.log(err);
          });
      }
    });
    //   this.confirmationService.confirm({
    //     message: 'Are you sure to delete this record',
    //     header: 'Delete Access Name',
    //     accept: () => {
    //       this.configService.deleteAccessName(accessNameModel).subscribe(()=>
    //       {
    //         this.getAccessNameByGroupId(this.groupId)
    //       })
    //     }
    // });

  }


  Edit(accessNameModel: AccessNameModel) {
    this.accessNameIdUpdate = accessNameModel.AccessNameID;
    this.groupAccessForm.controls['AccessName'].setValue(accessNameModel.AccessName);
    this.groupAccessForm.controls['AccessGroupId'].setValue(this.accessNameIdUpdate);
    this.groupAccessForm.controls['AccessNameId'].setValue(accessNameModel.AccessNameID);
    this.displayDialog = true;

  }



}
