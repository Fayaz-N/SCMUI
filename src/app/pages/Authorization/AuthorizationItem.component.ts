import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { toUnicode } from 'punycode';
import { RoleNameModel, AccessRoleModel, AccessNameModel, GroupMasterModel, checkboxSelect, AutrAuthorizationItemmodel, AccessNameModelNew } from 'src/app/Models/config.model';
import { Employee } from 'src/app/Models/mpr';
import { ConfigService } from 'src/app/services/config.service';
//import { link } from 'fs';


@Component({
  selector: 'app-AuthorizationItem',
  templateUrl: './AuthorizationItem.component.html',
  styleUrls: ['./AccessGroup.component.css']
})


export class AuthorizationItemComponent implements OnInit {
  public empl: Employee;
  groupAccessForm: FormGroup;
  selectedGroup: any = '';
  name = ''
  rolename = 0;
  groupname = '';
  AccessNameID = 0;
  roleNameModel: RoleNameModel[];
  accessNameData: AccessNameModel[];
  allmastermodel: GroupMasterModel[];
  accessnamenew: AccessNameModel[];
  groupId: number = 0;
  GroupName: string;
  displayDialog: boolean;
  searchText;
  show: false;
  array: AccessRoleModel[] = [];
  selectCheckbox: checkboxSelect = {};
  resultText = [];
  uncheckResult = [];
  values: string;
  count: number = 0;
  errorMsg: string;
  accessNamesId: number = 0;
  accessdiv: boolean = false;
  accessnamediv: boolean = false;
  AccessGroupId: number = 0;
  accnamestatus = '1';
  roleid: boolean = false;
  AccessNameId: number = 0;
  AuthItemData: AutrAuthorizationItemmodel[] = [];
  array1: AccessNameModel[] = [];
  array2: AutrAuthorizationItemmodel[] = [];
  //public totalAuthItems:Array<any>=[];
  public selectedAuthItems: Array<any> = [];
  public totalAuthItems: Array<AutrAuthorizationItemmodel> = [];
  accessbtn = false;
  groupnamenew: any;



  constructor(private router: Router, private activeroute: ActivatedRoute,
    private formBuilder: FormBuilder, private configService: ConfigService) {

  }

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.empl = JSON.parse(localStorage.getItem("Employee"))[0];
    else
      this.router.navigateByUrl("Login");

    this.groupAccessForm = this.formBuilder.group({
      RoleName: ['', [Validators.required]],
      GroupName: ['', [Validators.required]],
      AccessName: ['', [Validators.required]],
      RoleId: [0, [Validators.required]],
      AccessGroupId: [0, [Validators.required]]
    });
    this.getAllAuthRoleItem();
    this.getAllRoleName();
    //this.getallAccess(this.AccessGroupId); 
    this.accessdiv = false;
    //this.getAllGroupName();
  }

  addNewAccess() {
    // this.displayDialog=true;
    this.groupAccessForm.controls['AccessGroupId'].setValue(this.groupId);
    const groupAccess = this.groupAccessForm.value;
    //localStorage.setItem("AccessName",groupAccess.AccessName);
    this.CreateAccessName(groupAccess);
    this.groupAccessForm.reset();
    //this.getAllGroupName();     
  }

  CreateAccessName(accessNameModel: AccessNameModelNew) {
    {
      this.configService.createAccessName(accessNameModel).subscribe(() => {
        // this.groupId=accessNameModel.RoleId ;
        this.groupId = accessNameModel.AccessGroupId;
        this.groupAccessForm.reset();
        this.getAccessNamebyAccessGroupId(this.groupId);
      }
      );
    }
  }

  onChange(accessNamesId: number, event) {
    this.errorMsg = "";

    const checked = event.target.checked;
    if (checked == true) {

      this.resultText.push(accessNamesId);
    }
    else {
      this.uncheckResult.push(accessNamesId);
      this.resultText.forEach(i => {
        if (i == accessNamesId) {
          const index = this.resultText.indexOf(accessNamesId);
          this.resultText.splice(index, 1);
          const index1 = this.uncheckResult.indexOf(i);
          this.uncheckResult.splice(index1, 1);
        }
      })

    }
    console.log(this.resultText);
    console.log(this.uncheckResult);
  }

  onSubmit() {

    const count = this.resultText.length;
    const count2 = this.uncheckResult.length;
    if (this.resultText.length != 0) {
      this.selectCheckbox.resultText = this.resultText;
    }
    if (this.uncheckResult.length != 0) {
      this.selectCheckbox.uncheckResult = this.uncheckResult;
    }
    this.selectCheckbox.roleId = this.rolename;
    if (count == 0 && count2 == 0) {
      this.errorMsg = "Select the Checkbox";
    }
    else {
      this.accessnamenew = [];
      // this.roleNameModel=[];
      this.count = count;


      this.configService.addAccess(this.selectCheckbox).subscribe(response => {

        //this.getAllRoleName();
        this.getAccessNamebyId(this.groupId);

      });
    }

  }


  Cancel() {
    this.resultText = [];
    this.uncheckResult = [];
    this.accessnamediv = false;
    console.log(this.uncheckResult);

  }

  getAllRoleName() {
    this.configService.getRoleName().subscribe(data => {
      this.roleNameModel = data;
    }
    )
  }

  getAllAuthRoleItem() {
    this.configService.getAuthItems().subscribe(data => {
      this.AuthItemData = data;
    }
    )
  }


  getAccessNamebyAccessGroupId(AccessGroupId: number) {
    this.configService.getAccessNamebyAccessGroupId(AccessGroupId).subscribe(data => {
      this.roleid = data.some(e => e.AuthorizationItems.RoleId == this.rolename);
      this.accessNameData = data;
    }
    )
  }


  onSelectName({ AccessGroupId, RoleName, RoleId }): void {
    debugger
    this.getAllGroupName();
    this.name = RoleName;
    this.rolename = RoleId;
    localStorage.setItem("RoleId", RoleId);
    localStorage.setItem("RoleName", RoleName);
    this.groupId = AccessGroupId;
    this.accessdiv = true;
    this.accessnamediv = false;
    this.accessbtn = true;
  }


  checkAuthId(authId: number) {
    if (this.selectedAuthItems.filter(li => li.AccessNameId == authId && li.DeleteFlag == false).length > 0)
      return true;
    else {
      return false;
    }

  }
  Remove(accessNameModel: AccessNameModel, index: number, value) {
    alert("Are you sure to delete this record")
    this.configService.deleteGroupAccess(accessNameModel).subscribe(() => {
      this.getAccessNamebyAccessGroupId(this.groupId)
    })
  }


  Edit() {
    this.displayDialog = true;
  }

  getallAccess(AccessGroupId: number) {
    // console.log(AccessGroupId);
    this.accessnamediv = true;
    this.groupId = AccessGroupId;
    var gname = this.allmastermodel.filter(x => x.AccessGroupId == AccessGroupId)
    gname.map((i) => {
      this.groupnamenew = i.GroupName
    })
    this.getAccessNamebyAccessGroupId(this.groupId);
    this.getAccessNamebyId(this.groupId);
    // this.selectedAuthItems=this.AuthItemData.filter(li=>li.RoleId==RoleId);  
  }


  getAllGroupName() {
    this.configService.getAllGroupMaster().subscribe(data => {
      debugger
      this.allmastermodel = data;
      // console.log(this.allmastermodel);  
      this.allmastermodel = data.filter((value, index, self) => self
        .map(x => x.GroupName).indexOf(value.GroupName) == index)
    }
    )
  }

  getAccessNamebyId(AccessGroupId: number) {
    this.configService.getAccessNamebyId(AccessGroupId).subscribe(data => {
      this.accessnamenew = data;
      this.accessnamenew.forEach(item => {
        var data1 = this.AuthItemData.filter(li => li.AccessNamesId == item.AccessNameID)
        if (data1) {
          data1.map((i) => {

            item.AuthorizationItems.AccessNamesId = i.AccessNamesId;
            item.AuthorizationItems.DeleteFlag = i.DeleteFlag;
            item.AuthorizationItems.RoleId = i.RoleId;
            // console.log( this.accessnamenew);
          })
          // console.log( this.accessnamenew);             
        }

      })
    }
    )
  }


  onClick() {
    this.router.navigate(['SCM/Viewaccess'])
    // window.location.href = "http://localhost:4200/dashboard/viewaccess";
  }

}
