import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupMasterModel,AccessNameModel,AccessNameModelNew, AutrAuthorizationItemmodel,checkboxSelect } from '../Models/config.model';
import { GroupMastergetallModel,RoleNameModel } from '../Models/config.model';
import { GroupNameModel,AccessRoleModel} from '../Models/config.model';
import { RoleAccessModel } from '../Models/config.model';



@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  //url = 'http://10.29.15.165:90/Api/MPR';
  url = 'http://localhost:49659/Api/ConfigAccess';

  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private http: HttpClient) { }

//All Method for GroupMaster

  createNewGroupMaster(groupMasterModel: GroupMasterModel): Observable<any> {   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/AddNewGroupMaster/', groupMasterModel, httpOptions);
  }
  getAllGroupMaster(): Observable<GroupMastergetallModel[]> {  
    return this.http.get<GroupMastergetallModel[]>(this.url + '/getAllGroupMaster');  
  }

  deleteGroupMaster(groupmasterModel: GroupMastergetallModel): Observable<GroupMastergetallModel> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<GroupMastergetallModel>(this.url + '/DeleteGroupMaster',  groupmasterModel, httpOptions);      
  }

  updateGroupMaster(updategroupmasterModel: GroupMastergetallModel): Observable<GroupMastergetallModel> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<GroupMastergetallModel>(this.url + '/UpdateGroupMaster',  updategroupmasterModel, httpOptions);     
  }

  getAllGroupName(): Observable<GroupNameModel[]> {  
    return this.http.get<GroupNameModel[]>(this.url + '/getGroupNameDetail');  
  }




//All method for AccessNames

  createAccessName(accessNameModel: AccessNameModelNew): Observable<any> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/AddNewAccessName', accessNameModel, httpOptions);
  }

  getAccessName(): Observable<GroupMastergetallModel[]> {  
    return this.http.get<GroupMastergetallModel[]>(this.url + '/getAllGroupMaster');  
  }

  deleteGroupAccess(accessNameModel: AccessNameModel): Observable<AccessNameModel> {  
    debugger
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<AccessNameModel>(this.url + '/DeleteGroupAccess',  accessNameModel, httpOptions);    
  }
 
  getAllAccessName(GroupName: string): Observable<GroupNameModel> {  
    return this.http.get<GroupNameModel>(this.url + '/getAccessName/' + GroupName);  
  }

  //Update AccessName on cliclk of edit
  updateAccessName(accessNameModel: AccessNameModelNew): Observable<AccessNameModelNew> {  
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
  return this.http.post<AccessNameModelNew>(this.url + '/UpdateAccessName',  accessNameModel, httpOptions);     
}

//Delete AccessName on cliclk of edit
  deleteAccessName(accessNameModel: AccessNameModel): Observable<AccessNameModel> {  
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
  return this.http.post<AccessNameModel>(this.url + '/DeleteAccessName',  accessNameModel, httpOptions);     
}

  //All Method for AuthGroup
  
  createRoleAccess(roleAccessModel: RoleAccessModel): Observable<any> {   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/AddNewRole/', roleAccessModel, httpOptions);
  }

  getAllRoleName(): Observable<RoleAccessModel[]> {  
    return this.http.get<RoleAccessModel[]>(this.url + '/getAllRole');  
  }



  //All Method for Role Based Access Label

  getAccessNamebyGroupId(accessGroupId:number): Observable<AccessNameModel[]>{
    return this.http.get<AccessNameModel[]>(this.url + '/getAccessNameById' + '?accessGroupId=' + accessGroupId);
  }
  getAllNamebyId(roleId:number): Observable<AccessRoleModel[]>{
    return this.http.get<AccessRoleModel[]>(this.url + '/getAllGroupById' + '?roleId=' + roleId);
  }

  getRoleName(): Observable<RoleNameModel[]> {  
    return this.http.get<RoleNameModel[]>(this.url + '/getAllRoleName');  
  }
  getAuthItems(): Observable<any> {  
    return this.http.get<any>(this.url + '/getAuthorizationItemDetail');  
  }
  
  
  addAccess(roleAccessModel: checkboxSelect): Observable<any[]> {  
    let params = new HttpParams();
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(this.url + '/AddAccessRole' , roleAccessModel, httpOptions);
  }
  
  getAccessNamebyAccessGroupId(accessGroupId:number): Observable<AccessNameModel[]>{
    return this.http.get<AccessNameModel[]>(this.url + '/getGroupAccessNameById' + '?accessGroupId=' + accessGroupId);
  }

  getAccessNamebyId(accessGroupId:number): Observable<AccessNameModel[]>{
    return this.http.get<AccessNameModel[]>(this.url + '/getAccessNameById' + '?accessGroupId=' + accessGroupId);
  }

  UpdateAccess(roleAccessModel: number[]): Observable<number[]> {   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<number[]>(this.url + '/UpdateAccess', roleAccessModel, httpOptions);
  }

  createAccess(roleAccessModel: RoleAccessModel): Observable<any> {   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/AddAccess/', roleAccessModel, httpOptions);
  }

  //Update AuthRole on cliclk of edit
  updateAuthRole(roleAccessModel: RoleAccessModel): Observable<RoleAccessModel> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<RoleAccessModel>(this.url + '/UpdateAuthRole',  roleAccessModel, httpOptions);     
  }
  
  //Delete AuthRole on cliclk of edit
    deleteAuthRole(roleAccessModel: RoleAccessModel): Observable<RoleAccessModel> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<RoleAccessModel>(this.url + '/DeleteAuthRole',  roleAccessModel, httpOptions);     
  }

  getAllAccessNameData(): Observable<AccessNameModel[]>{
    return this.http.get<AccessNameModel[]>(this.url + '/getAllAccessName');
  }
}
