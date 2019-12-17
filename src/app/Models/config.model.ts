export class GroupMasterModel {
    GroupName: string;
    AccessGroupId : number;
  }

  export class GroupMastergetallModel {
    GroupName: string;
    AccessGroupId : number;
  }

  export class GroupNameModel {
    GroupName: string;
  }

  export class RoleAccessModel {
    RoleName: string;
    RoleId:any;
    AccessNameID:any;
    
  }
  export class AccessNameModel {
    AccessNameID:number;
    AccessGroupId:number;
    AccessName:string;
    GroupName:string;
    AccessNameStatus:boolean;
    AccessGroupMaster:GroupMasterModel;
    AuthorizationItems:AutrAuthorizationItemmodel;
    DeleteFlag:boolean=false;
    //RoleId : number;
    //AccessNamesId:number;
    // RoleAccessNameid:number;
    
  }
  export class AccessNameModelNew {
    AccessName:string;
    AccessGroupId:number;
    GroupName:string;
    AccessNameID:number;
    RoleId:number;
    AccessNameStatus:boolean;
    AccessGroupMaster:GroupMasterModel;
    DeleteFlag:any;
    
  }

  export class RoleNameModel {
    RoleName: string;
  }

  export class AccessRoleModel {
    RoleName: string;
    RoleId:number;
    RoleAccessNameid:number;
    GroupName:string;
    AccessNamesId:number;
    AccessGroupId:number;
    AccessName:string;
    AccessNameID:number;
    AccessNameStatus:boolean;
    AccessGroupMaster:GroupMasterModel;
  }

  export class AutrAuthorizationItemmodel{
    RoleId : number;
    AccessNamesId:number=0;
     DeleteFlag : boolean=false;
     //AccessNameID:number=0;
     RoleAccessNameid:number;
   
      
  }
  export class  checkboxSelect{
   public resultText ? : number[]  ;
   public uncheckResult ? : number[];
   public roleId ? : number;
  }

 


  