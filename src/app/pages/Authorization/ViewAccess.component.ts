import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Router, ParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GroupMasterModel, AccessNameModel, AutrAuthorizationItemmodel } from 'src/app/Models/config.model';
import { ConfigService } from 'src/app/services/config.service';
import { ViewAccessService } from 'src/app/services/viewaccess.service';
import { Employee } from 'src/app/Models/mpr';

@Component({
  selector: 'app-ViewAccess',
  templateUrl: './ViewAccess.component.html',
  styleUrls: ['./AccessGroup.component.css']
})
export class ViewAccessComponent implements OnInit {
  public employee: Employee;
  allgroupnamemodel: GroupMasterModel[];
  accessnamenew: AccessNameModel[];
  accessnamenew1: AccessNameModel[];
  AuthItemData: AutrAuthorizationItemmodel[] = [];
  groupName: any;
  RoleId: number = 0;
  viewmessage = false;
  roleName: string;

  constructor(private router: Router, private activeroute: ActivatedRoute,
    private formBuilder: FormBuilder, private configService: ConfigService, private viewaccessservice: ViewAccessService) {
    this.accessnamenew = [];
  }

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"))[0];
    else
      this.router.navigateByUrl("Login");

    const roleID = localStorage.getItem("RoleId");
    this.RoleId = +roleID;
    this.roleName = localStorage.getItem("RoleName");
    this.getGroupNameDetail();
    this.getAllAuthRoleAccessItem(this.RoleId);
  }

  getAllAuthRoleAccessItem(roleid: any) {
    this.viewaccessservice.getAuthItemDataforView(roleid).subscribe(data => {
      this.AuthItemData = data;
      this.getAllAccessNameData();
    }
    )
  }
  getGroupNameDetail() {
    debugger
    this.configService.getAllGroupMaster().subscribe(data => {

      this.allgroupnamemodel = data;
      this.allgroupnamemodel = data.filter((value, index, self) => self
        .map(x => x.GroupName).indexOf(value.GroupName) == index)
    }
    )
  }

  getAllAccessNameData() {
    this.configService.getAllAccessNameData().subscribe(data => {
      this.accessnamenew = data;


      this.accessnamenew.forEach(item => {

        var data1 = this.AuthItemData.filter(li => li.AccessNamesId == item.AccessNameID)
        if (data1) {
          data1.map((i) => {

            item.AuthorizationItems.AccessNamesId = i.AccessNamesId;
            item.AuthorizationItems.DeleteFlag = i.DeleteFlag;
            item.AuthorizationItems.RoleId = i.RoleId;
            item.AuthorizationItems.RoleAccessNameid = i.RoleAccessNameid;

          })
          //this.accessnamenew1.push(item);         
          this.groupName = [...new Set(this.accessnamenew.map(item3 => item3.AccessGroupMaster.GroupName))];
          this.viewmessage = true;

        }

      })

      console.log(this.accessnamenew1);
      console.log(this.accessnamenew);
      console.log(this.groupName);
    }
    )
  }



}
