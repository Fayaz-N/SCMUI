import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PADetailsModel, ItemsViewModel, DepartmentModel, PAAuthorizationLimitModel, PAAuthorizationEmployeeMappingModel, PACreditDaysMasterModel, PACreditDaysApproverModel, mprpapurchasemodesmodel, mprpapurchasetypesmodel, mprpadetailsmodel, PAApproverDetailsInputModel, MPRPAApproversModel } from '../Models/PurchaseAuthorization';
import { constants } from '../Models/MPRConstants'
import { Employee } from '../Models/mpr';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class purchaseauthorizationservice {
    public itemvalues=[];

    private _datasource = new Subject<ItemsViewModel[]>();
    itemdat$ = this._datasource.asObservable();
  constructor(private http: HttpClient, private constants: constants) { }
  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  public url = this.constants.url;
  
  getRFQItems(RevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/getRFQItems/' + RevisionId);
    }
    LoadItems(details: PADetailsModel): Observable<ItemsViewModel[]> {
        return this.http.post<ItemsViewModel[]>(this.url + 'RFQ/GetItemsByMasterIDs', details, this.httpOptions);
    }
    ApproveItems(item: any): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/GetEmployeeMappings', item, this.httpOptions);
    }

    Approve(details: PADetailsModel): Observable<ItemsViewModel[]> {
        return this.http.post<ItemsViewModel[]>(this.url + 'RFQ/GetEmployeeMappings', details, this.httpOptions);
    }

    LoadAllDepartments(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllMPRDepartments', this.httpOptions);
    }

    LoadSlabsByDepartmentID(deptID: number): Observable<any> {
        debugger;
        return this.http.get<any>(this.url + 'RFQ/GetSlabsByDepartmentID/'+ deptID);
    }
    LoadAllemployees(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllEmployee', this.httpOptions);
    }
    LoadAllFunctionalMappings(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllPAFunctionalRoles', this.httpOptions);
    }
    InsertPAAuthorizationLimits(paauthorization: PAAuthorizationLimitModel): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/InsertPAAuthorizationLimits', paauthorization, this.httpOptions);
    }
    InsertEmployeeMapping(employemapping: PAAuthorizationEmployeeMappingModel): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/CreatePAAuthirizationEmployeeMapping', employemapping, this.httpOptions);
    }
    InsertCreditMaster(credit: PACreditDaysMasterModel): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/CreatePACreditDaysmaster', credit, this.httpOptions);
    }
    GetAllCredits(): Observable<PAAuthorizationLimitModel[]> {
        return this.http.get<PAAuthorizationLimitModel[]>(this.url + 'RFQ/GetAllCredits', this.httpOptions);
    }
    InsertCreditApprovers(creditapprover: PACreditDaysApproverModel): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/AssignCreditdaysToEmployee', creditapprover, this.httpOptions);
    }
    LoadAllCreditDays(): Observable<PACreditDaysMasterModel[]> {
        return this.http.get<PACreditDaysMasterModel[]>(this.url + 'RFQ/GetAllCreditDays', this.httpOptions);
    }
    LoadAllMappedCredits(): Observable<any>{
        return this.http.get<any>(this.url + 'RFQ/GetCreditSlabsandemployees', this.httpOptions);
    }
    LoadEmployeemappedPurchases(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetPurchaseSlabsandMappedemployees', this.httpOptions);
    }
    LoadAllmprpapurchasemodes(): Observable<mprpapurchasemodesmodel[]> {
        return this.http.get<mprpapurchasemodesmodel[]>(this.url + 'RFQ/GetAllMprPAPurchaseModes', this.httpOptions);
    }
    LoadAllmprpapurchasetypes(): Observable<mprpapurchasetypesmodel[]> {
        return this.http.get<mprpapurchasetypesmodel[]>(this.url + 'RFQ/GetAllMprPAPurchaseTypes', this.httpOptions);
    }
    InsertPurchaseAuthorization(purchasedetails: mprpadetailsmodel): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/InsertPurchaseAuthorization', purchasedetails, this.httpOptions);
    }
    LoadMprPADeatilsbyid(PID: number): Observable<mprpadetailsmodel> {
        return this.http.get<mprpadetailsmodel>(this.url + 'RFQ/GetMPRPADeatilsByPAID/'+ PID, this.httpOptions);
    }
    LoadMprPAList(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllMPRPAList', this.httpOptions);
    }
    LoadAllmprBuyerGroups(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllMPRBuyerGroups', this.httpOptions);
    }
    RemovePACreditDaysApprover(mappingdata: any): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/RemovePACreditDaysApprover', mappingdata, this.httpOptions);
    }
    RemovePurchaseApprover(mappingdata: any): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/RemovePurchaseApprover', mappingdata, this.httpOptions);
    }

    LoadVendorbymprdeptids(MPRItemDetailsid: any): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/LoadVendorByMprDetailsId', MPRItemDetailsid, this.httpOptions);
    }
    loadAllmprpaapproverslist(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllApproversList', this.httpOptions);
    }

    getdata(data: any, data1: any) {
        debugger;
        this._datasource.next(data);
    }
    LoadmprApproverDetailsbySearch(inputsearch: PAApproverDetailsInputModel): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/GetMprApproverDetailsBySearch', inputsearch, this.httpOptions);
    }
    Updatepaapproverstatus(approvers: MPRPAApproversModel): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/UpdateMprpaApproverStatus', approvers, this.httpOptions);
    }
    getrfqtermsbyrevisionid(rfqrevisionid: any): Observable<any> {
        return this.http.post<any>(this.url + 'RFQ/getrfqtermsbyrevisionid', rfqrevisionid, this.httpOptions);
    }
}
