import { Component,Input , OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup,Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {ConfigService} from '../services/Config.service';
import{GroupMasterModel} from '../Models/config.model';
import { GroupMastergetallModel } from '../Models/config.model';
import { GroupNameModel } from '../Models/config.model';
import { RoleAccessModel } from '../Models/config.model';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../common/confirmationdialog/confirmation-dialog.component';




@Component({
  selector: 'app-RoleAccess',
  templateUrl: './RoleAccess.component.html',
  styleUrls: [ './AccessGroup.component.css' ] 
})
export class RoleAccessComponent implements OnInit {

  
  groupMasterForm:FormGroup;
 
  groupNameModel:GroupNameModel[];
  roleAccessModel:RoleAccessModel[];
  newData : boolean;
  submitted = false;
  roleIdUpdate : number = null;

  GroupName:string;
  searchText;
 
  constructor(private router: Router,private activeroute: ActivatedRoute,
    private formBuilder: FormBuilder,private configService:ConfigService,private _dialog:MatDialog) 
  { 
   
   
  }

  ngOnInit() {

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
  else{
    this.CreateRoles(role);  
    this.groupMasterForm.reset(); 
  }  
  }
  get f() { return this.groupMasterForm.controls; }

  CreateRoles(roleAccessModel:RoleAccessModel) {  
    this.submitted = true;
    if(this.roleIdUpdate == null){
   this.configService.createRoleAccess(roleAccessModel).subscribe(data => {  
    alert(data);
     this.getAllRole();
       this.groupMasterForm.reset(); 
       this.submitted = false;
            
     }  
   );  
    }
    else{
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
getAllRole(){
this.configService.getAllRoleName().subscribe(data=>{
    this.roleAccessModel=data;
    console.log(this.roleAccessModel);  
}
)}

Remove(roleAccessModel:RoleAccessModel,index:number,value){
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

getallGroup(){
 //alert("Hello") 
}


Edit(roleaccess:RoleAccessModel){
  this.newData = false;
  this.roleIdUpdate = roleaccess.RoleId;
  this.groupMasterForm.controls['RoleName'].setValue(roleaccess.RoleName);
 
   //this.displayDialog = true;
 
 }
 

  
}
