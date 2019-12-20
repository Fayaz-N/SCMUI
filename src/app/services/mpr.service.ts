import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DynamicSearchResult, mprRevision, MPRItemInfoes, MPRDocument, MPRVendorDetail, MPRDocumentations, MPRStatusUpdate, mprFilterParams } from '../Models/mpr';

@Injectable({
  providedIn: 'root'
})
export class MprService {
  //url = 'http://10.29.15.165:90/Api/MPR';
  url = 'http://localhost:49659/Api/MPR';
  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private http: HttpClient) { }

  //getAllEmployee(): Observable<Employee[]> {
  //  return this.http.get<Employee[]>(this.url + '/AllEmployeeDetails');
  //}
  getRecordsCount(search: DynamicSearchResult): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<number>(this.url + '/GetRecordsCount/', search, httpOptions);
  }
  GetListItems(search: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/GetListItems/', search, httpOptions);
  }
  updateMPR(mpr: mprRevision): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/UpdateMPR/', mpr, httpOptions);
  }
  getMPRRevisionDetails(RevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + '/getMPRRevisionDetails/' + RevisionId);
  }
  getEmployeeList(): Observable<any> {
    return this.http.get<any>(this.url + '/getEmployeeList/', this.httpOptions);
  }
  getMPRList(mprFilterParams: mprFilterParams): Observable<mprRevision[]> {
    return this.http.post<mprRevision[]>(this.url + '/getMPRList/', mprFilterParams, this.httpOptions);
  }

  getMprRevisionList(RequisitionId: number): Observable<mprRevision[]> {
    return this.http.get<any>(this.url + '/getMprRevisionList/' + RequisitionId);
  }
  deleteMPRItemInfo(mprItemInfo: MPRItemInfoes): Observable<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/deleteMPRItemInfo/', mprItemInfo, httpOptions);
  }
  deleteMPRDocument(mprDocument: MPRDocument): Observable<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/deleteMPRDocument/', mprDocument, httpOptions);
  }
  deleteMPRVendor(mprvendor: MPRVendorDetail): Observable<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/deleteMPRVendor/', mprvendor, httpOptions);
  }
  deleteDocumentation(MPRDocumentation: MPRDocumentations): Observable<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/deleteMPRDocumentation/', MPRDocumentation, httpOptions);
  }
  statusUpdate(MPRStatusUpdate: MPRStatusUpdate): Observable<mprRevision> {
    return this.http.post<mprRevision>(this.url + '/statusUpdate/', MPRStatusUpdate, this.httpOptions);
  }
  getStatusList(): Observable<any> {
    return this.http.get<any>(this.url + '/getStatusList/', this.httpOptions);
  }

  updateMPRVendor(mprVendor: MPRVendorDetail[], RevisionId: number): Observable<any[]> {
    return this.http.post<any[]>(this.url + '/updateMPRVendor/'+RevisionId, mprVendor, this.httpOptions);
  }
  //added masters

  getDBMastersList(search: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/getDBMastersList', search, httpOptions);
  }

  addDataToDBMasters(addData: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/addDataToDBMasters', addData, httpOptions);
  }

  updateDataToDBMasters(updateData: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/updateDataToDBMasters', updateData, httpOptions);
  }
  //Login

  ValidateLoginCredentials(search: DynamicSearchResult): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + '/ValidateLoginCredentials', search, httpOptions);
  }
}
