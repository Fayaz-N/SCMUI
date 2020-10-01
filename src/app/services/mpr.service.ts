import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DynamicSearchResult, mprRevision, MPRItemInfoes, MPRDocument, MPRVendorDetail, MPRDocumentations, MPRStatusUpdate, mprFilterParams, Employee, MPRBuyerGroup, MPRApprovers, VendorMaster, sendMailObj, DeleteMpr, materialUpdate, vendorRegfilters, VendorRegApprovalProcess, YILTermsGroup, YILTermsandCondition } from '../Models/mpr';
import { map } from 'rxjs/operators';
import { constants } from '../Models/MPRConstants'

@Injectable({
  providedIn: 'root'
})
export class MprService {

  public url = this.constants.url;
  public vscmurl = this.constants.vscmurl;
  public accessTokenUrl = this.constants.accessTokenUrl;
  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer PPCRbsP3beI49XTuG6yKwr9RGL_Vv5-B5MEzBD6k3j6hc9VsCqfGvy14-aBIyXms0odjNS9eahOFhiv7jytiJyibh80MujGAbG44fbQTZb2SIZv2FETb-zrdL3Mw-pPRK3HjuWBZTh09soP68_EDqw91mH7-4uYgswWpTHGkJpHQcZ6NWp3J0nbdEaGDC17w6D-qWUiWIQHbWg1UXeAmwg' }) };
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
  //GetLoginListItems(search: DynamicSearchResult) {
  //  // const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //  return this.http.post<any>(this.url + 'MPR/GetListItems/', search)
  //    .pipe(map(data => {
  //      const object = Object.assign({}, ...data);
  //      localStorage.setItem('Employee', JSON.stringify(object));
  //      this.currentUserSubject.next(object);
  //      return object;
  //    }))
  //}

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

  getSavingsReport(mprFilterParams: mprFilterParams): Observable<mprRevision[]> {
    return this.http.post<mprRevision[]>(this.url + 'MPR/getSavingsReport/', mprFilterParams, this.httpOptions);
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

  getAccessList(roleId: number): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/getAccessList/' + roleId, this.httpOptions);
  }
  updateMPRVendor(mprVendor: MPRVendorDetail[], RevisionId: number): Observable<boolean> {
    return this.http.post<boolean>(this.url + 'MPR/updateMPRVendor/' + RevisionId, mprVendor, this.httpOptions);
  }

  addNewVendor(newVendordetails: VendorMaster): Observable<any> {
    return this.http.post<boolean>(this.url + 'MPR/addNewVendor', newVendordetails, this.httpOptions);
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
  getAuth_token(data1: any) {
    var data = "username=" + data1.DomainId + "&password=" + data1.Password + "&grant_type=password";

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };
    return this.http.post<any>(this.accessTokenUrl, data, httpOptions);
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
  uploadExcel(formdata: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/uploadExcel/', formdata)
      .pipe(map(data => {
        return data;
      }))
  }
  uploadVendorData(formdata: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/uploadVendorData/', formdata)
      .pipe(map(data => {
        return data;
      }))
  }
  DownloadFile(fileName: string): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/DownloadFile/' + fileName, this.httpOptions);
  }
  copyMprRevision(mpr: mprRevision, repeatOrder: boolean, revise: boolean): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/copyMprRevision/' + repeatOrder + "/" + revise, mpr, this.httpOptions);
  }

  DeleteMpr(deleteinfo: DeleteMpr): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/deleteMPR/', deleteinfo, this.httpOptions);
  }

  sendMailtoVendor(mailObj: sendMailObj): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/sendMailtoVendor/', mailObj, this.httpOptions);
  }
  updateItemId(data: materialUpdate): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/updateItemId/', data, this.httpOptions);
  }
  //save file in cloud server
  InsertDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(this.vscmurl + 'UploadFile/', formData)
      .pipe(map(data => { return data }));
  }
  Loadstoragelocationbydepartment(): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/Loadstoragelocationsbydepartment', this.httpOptions);
  }
  LoadJobCodesbysaleorder(saleorder: number): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/LoadJobCodesbysaleorder/' + saleorder);
  }

  //updateVendorRegProcess
  updateVendorRegProcess(data: VendorRegApprovalProcess, typeOfUser: string): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/updateVendorRegProcess/' + typeOfUser + '', data, this.httpOptions);
  }

  //get vendor registered list
  getVendorReqList(data: vendorRegfilters): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/getVendorReqList', data, this.httpOptions)
  }

  //vendor registration editing
  GetStateList(): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/GetStateList', this.httpOptions);
  }
  GetDocumentTypeList(): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/GetDocumentTypeList', this.httpOptions);
  }
  GetNatureofBusinessList(): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/GetNaturOfBusiness', this.httpOptions);
  }
  getvendordetails(vendorid: any): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/Getvendordetails/' + vendorid, this.httpOptions);
  }
  SaveVendorDetails(vendorList: any): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/SaveVendorDetails/', JSON.stringify(vendorList), this.httpOptions);
  }

  UploadVendorRegFile(formData: FormData): Observable<any> {
    return this.http.post<any>(this.vscmurl + 'UploadVendorRegFile/', formData)
      .pipe(map(data => { return data }));
  }
  deleteRegAttachedfile(redDoc: any): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/deleteRegAttachedfile/', redDoc, this.httpOptions);
  }

  GetYILTermGroups(): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/GetYILTermGroups/', this.httpOptions);
  }
  UpdateYILTermsGroup(YILTermGroup: YILTermsGroup): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/UpdateYILTermsGroup', YILTermGroup, this.httpOptions);
  }
  UpdateYILTermsAndConditions(YILTermsandCondition: YILTermsandCondition): Observable<any> {
    return this.http.post<any>(this.url + 'MPR/UpdateYILTermsAndConditions', YILTermsandCondition, this.httpOptions);
  }

  DeleteTermGroup(TermGroupId: number, DeletedBy: string): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/DeleteTermGroup/' + TermGroupId + '/' + DeletedBy);
  }
  DeleteTermsAndConditions(TermId: number,DeletedBy: string): Observable<any> {
    return this.http.get<any>(this.url + 'MPR/DeleteTermsAndConditions/' + TermId + '/' + DeletedBy);
  }

}

