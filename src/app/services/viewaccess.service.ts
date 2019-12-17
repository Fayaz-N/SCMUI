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
export class ViewAccessService {
  //url = 'http://10.29.15.165:90/Api/MPR';
  url = 'http://localhost:49659/Api/ConfigAccess';

  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private http: HttpClient) { }

  getAuthItemDataforView(roleid:any): Observable<any> {  
    return this.http.get<any>(this.url + '/getAuthorizationItemDetailById' + '?roleid=' + roleid);  
  }
  getAllAccessNameData(): Observable<AccessNameModel[]>{
    return this.http.get<AccessNameModel[]>(this.url + '/getAllAccessNameData');
  }
}