import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupMasterModel, AccessNameModel, AccessNameModelNew, AutrAuthorizationItemmodel, checkboxSelect } from '../Models/config.model';
import { GroupMastergetallModel, RoleNameModel } from '../Models/config.model';
import { GroupNameModel, AccessRoleModel } from '../Models/config.model';
import { RoleAccessModel } from '../Models/config.model';
import { constants } from '../Models/MPRConstants'

@Injectable({
  providedIn: 'root'
})
export class ViewAccessService {
  constructor(private http: HttpClient, private constants: constants) { }
  public url = this.constants.url;
  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  getAuthItemDataforView(roleid: any): Observable<any> {
    return this.http.get<any>(this.url + 'ConfigAccess/getAuthorizationItemDetailById' + '?roleid=' + roleid);
  }
  getAllAccessNameData(): Observable<AccessNameModel[]> {
    return this.http.get<AccessNameModel[]>(this.url + 'ConfigAccess/getAllAccessNameData');
  }
}
