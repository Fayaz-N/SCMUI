import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DynamicSearchResult, mprRevision, MPRItemInfoes, MPRDocument, MPRVendorDetail, MPRDocumentations, MPRStatusUpdate, mprFilterParams, Employee, MPRBuyerGroup, MPRApprovers } from '../Models/mpr';
import { map } from 'rxjs/operators';
import { constants } from '../Models/MPRConstants'

@Injectable({
  providedIn: 'root'
})
export class MprService {

  public url = this.constants.url;
  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  private currentUserSubject: BehaviorSubject<Employee>;
  public currentUser: Observable<Employee>;
  constructor(private http: HttpClient, private constants: constants) {
    this.currentUserSubject = new BehaviorSubject<Employee>(JSON.parse(localStorage.getItem('Employee')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): Employee {
    return this.currentUserSubject.value;
  }


  getRecordsCount(search: DynamicSearchResult): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<number>(this.url + 'MPR/GetRecordsCount/', search, httpOptions);
  }
  GetListItems(search: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/GetListItems/', search, httpOptions);
  }
  GetLoginListItems(search: DynamicSearchResult) {
    // const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/GetListItems/', search)
      .pipe(map(data => {
        const object = Object.assign({}, ...data);
        localStorage.setItem('Employee', JSON.stringify(object));
        this.currentUserSubject.next(object);
        return object;
      }))
  }

  updateMPR(mpr: mprRevision): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/UpdateMPR/', mpr, httpOptions);
  }
  getMPRRevisionDetails(RevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/getMPRRevisionDetails/' + RevisionId);
  }
  getEmployeeList(): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/getEmployeeList/', this.httpOptions);
  }
  getMPRList(mprFilterParams: mprFilterParams): Observable<mprRevision[]> {
    return this.http.post<mprRevision[]>(this.url + 'MPR/getMPRList/', mprFilterParams, this.httpOptions);
  }
  ChechMPRlendingList(preparedBy: string): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/getMPRPendingListCnt/' + preparedBy, this.httpOptions);
  }
  getMprRevisionList(RequisitionId: number): Observable<mprRevision[]> {
    return this.http.get<any>(this.url + 'MPR/getMprRevisionList/' + RequisitionId);
  }
  deleteMPRItemInfo(mprItemInfo: MPRItemInfoes): Observable<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/deleteMPRItemInfo/', mprItemInfo, httpOptions);
  }
  deleteMPRDocument(mprDocument: MPRDocument): Observable<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/deleteMPRDocument/', mprDocument, httpOptions);
  }
  deleteMPRVendor(mprvendor: MPRVendorDetail): Observable<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/deleteMPRVendor/', mprvendor, httpOptions);
  }
  deleteDocumentation(MPRDocumentation: MPRDocumentations): Observable<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/deleteMPRDocumentation/', MPRDocumentation, httpOptions);
  }
  statusUpdate(MPRStatusUpdate: MPRStatusUpdate): Observable<mprRevision> {
    return this.http.post<mprRevision>(this.url + 'MPR/statusUpdate/', MPRStatusUpdate, this.httpOptions);
  }
  getStatusList(): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/getStatusList/', this.httpOptions);
  }

  updateMPRVendor(mprVendor: MPRVendorDetail[], RevisionId: number): Observable<boolean> {
    return this.http.post<boolean>(this.url + 'MPR/updateMPRVendor/' + RevisionId, mprVendor, this.httpOptions);
  }

  //added masters

  getDBMastersList(search: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/getDBMastersList', search, httpOptions);
  }

  addDataToDBMasters(addData: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/addDataToDBMasters', addData, httpOptions);
  }

  updateDataToDBMasters(updateData: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/updateDataToDBMasters', updateData, httpOptions);
  }
  //Login
  ValidateLoginCredentials(search: DynamicSearchResult) {
    // const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'MPR/ValidateLoginCredentials/', search)
      .pipe(map(data => {
        if (data.EmployeeNo != null) {
          //const object = Object.assign({}, ...data);
          localStorage.setItem('Employee', JSON.stringify(data));
          this.currentUserSubject.next(data);
        }
        return data;
      }))
  }

  getMPRBuyerGroups(): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get<MPRBuyerGroup[]>(this.url + 'RFQ/GetAllMPRBuyerGroups', httpOptions);
  }

  addMPRBuyerGroup(buyerGroup: MPRBuyerGroup): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'RFQ/InsertBuyerGroup', buyerGroup, httpOptions);
  }

  updateMPRBuyerGroup(buyerGroup: MPRBuyerGroup): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'RFQ/UpdateMprBuyerGroups', buyerGroup, httpOptions);
  }

  getMPRApprovers(): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get<MPRBuyerGroup[]>(this.url + 'RFQ/GetAllMPRApprovers', httpOptions);
  }

  addMPRApprovers(mprApprover: MPRApprovers): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(this.url + 'RFQ/InsertMPRApprover', mprApprover, httpOptions);
  }
  logout() {
    //localStorage.removeItem('Employee');
    this.currentUserSubject.next(null);
    //window.location.reload();
  }
  uploadFile(formdata: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/UploadFile/', formdata)
      .pipe(map(data => {
        return data;
      }))
  }
  DownloadFile(fileName: string): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/DownloadFile/' + fileName, this.httpOptions);
  }
}

