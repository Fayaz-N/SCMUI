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
        return this.http.post<ItemsViewModel[]>(this.url + 'PA/GetItemsByMasterIDs', details, this.httpOptions);
    }
    ApproveItems(item: any): Observable<any> {
        return this.http.post<any>(this.url + 'PA/GetEmployeeMappings', item, this.httpOptions);
    }

    Approve(details: PADetailsModel): Observable<ItemsViewModel[]> {
        return this.http.post<ItemsViewModel[]>(this.url + 'PA/GetEmployeeMappings', details, this.httpOptions);
    }

    LoadAllDepartments(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllMPRDepartments', this.httpOptions);
    }

    LoadSlabsByDepartmentID(deptID: number): Observable<any> {
        debugger;
        return this.http.get<any>(this.url + 'PA/GetSlabsByDepartmentID/'+ deptID);
    }
    LoadAllemployees(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllEmployee', this.httpOptions);
    }
    LoadAllFunctionalMappings(): Observable<any> {
        return this.http.get<any>(this.url + 'PA/GetAllPAFunctionalRoles', this.httpOptions);
    }
    InsertPAAuthorizationLimits(paauthorization: PAAuthorizationLimitModel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/InsertPAAuthorizationLimits', paauthorization, this.httpOptions);
    }
    InsertEmployeeMapping(employemapping: PAAuthorizationEmployeeMappingModel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/CreatePAAuthirizationEmployeeMapping', employemapping, this.httpOptions);
    }
    InsertCreditMaster(credit: PACreditDaysMasterModel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/CreatePACreditDaysmaster', credit, this.httpOptions);
    }
    GetAllCredits(): Observable<PAAuthorizationLimitModel[]> {
        return this.http.get<PAAuthorizationLimitModel[]>(this.url + 'PA/GetAllCredits', this.httpOptions);
    }
    InsertCreditApprovers(creditapprover: PACreditDaysApproverModel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/AssignCreditdaysToEmployee', creditapprover, this.httpOptions);
    }
    LoadAllCreditDays(): Observable<PACreditDaysMasterModel[]> {
        return this.http.get<PACreditDaysMasterModel[]>(this.url + 'PA/GetAllCreditDays', this.httpOptions);
    }
    LoadAllMappedCredits(): Observable<any>{
        return this.http.get<any>(this.url + 'PA/GetCreditSlabsandemployees', this.httpOptions);
    }
    LoadEmployeemappedPurchases(): Observable<any> {
        return this.http.get<any>(this.url + 'PA/GetPurchaseSlabsandMappedemployees', this.httpOptions);
    }
    LoadEmployeemappedPurchasesBydeptid(mapping: any): Observable<any> {
        return this.http.post<any>(this.url + 'PA/GetPurchaseSlabsandMappedemployeesByDeptId', mapping, this.httpOptions);
    }
    LoadAllmprpapurchasemodes(): Observable<mprpapurchasemodesmodel[]> {
        return this.http.get<mprpapurchasemodesmodel[]>(this.url + 'PA/GetAllMprPAPurchaseModes', this.httpOptions);
    }
    LoadAllmprpapurchasetypes(): Observable<mprpapurchasetypesmodel[]> {
        return this.http.get<mprpapurchasetypesmodel[]>(this.url + 'PA/GetAllMprPAPurchaseTypes', this.httpOptions);
    }
    InsertPurchaseAuthorization(purchasedetails: mprpadetailsmodel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/InsertPurchaseAuthorization', purchasedetails, this.httpOptions);
    }
    LoadMprPADeatilsbyid(PID: number): Observable<mprpadetailsmodel> {
        return this.http.get<mprpadetailsmodel>(this.url + 'PA/GetMPRPADeatilsByPAID/'+ PID, this.httpOptions);
    }
    LoadMprPAList(): Observable<any> {
        return this.http.get<any>(this.url + 'PA/GetAllMPRPAList', this.httpOptions);
    }
    LoadAllmprBuyerGroups(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllMPRBuyerGroups', this.httpOptions);
    }
    RemovePACreditDaysApprover(mappingdata: any): Observable<any> {
        return this.http.post<any>(this.url + 'PA/RemovePACreditDaysApprover', mappingdata, this.httpOptions);
    }
    RemovePurchaseApprover(mappingdata: any): Observable<any> {
        return this.http.post<any>(this.url + 'PA/RemovePurchaseApprover', mappingdata, this.httpOptions);
    }
    RemoveMappedSlab(slabdata: any): Observable<any> {
        return this.http.post<any>(this.url + 'PA/RemoveMappedSlab', slabdata, this.httpOptions);
    }
    LoadVendorbymprdeptids(MPRItemDetailsid: any): Observable<any> {
        return this.http.post<any>(this.url + 'PA/LoadVendorByMprDetailsId', MPRItemDetailsid, this.httpOptions);
    }
    loadAllmprpaapproverslist(): Observable<any> {
        return this.http.get<any>(this.url + 'PA/GetAllApproversList', this.httpOptions);
    }

    getdata(data: any, data1: any) {
        debugger;
        this._datasource.next(data);
    }
    LoadmprApproverDetailsbySearch(inputsearch: PAApproverDetailsInputModel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/GetMprApproverDetailsBySearch', inputsearch, this.httpOptions);
    }
    Updatepaapproverstatus(approvers: MPRPAApproversModel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/UpdateMprpaApproverStatus', approvers, this.httpOptions);
    }
    getrfqtermsbyrevisionid(rfqrevisionid: any): Observable<any> {
        return this.http.post<any>(this.url + 'PA/getrfqtermsbyrevisionid', rfqrevisionid, this.httpOptions);
    }
    InsertPAitems(paitem: ItemsViewModel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/InsertPaitems', paitem, this.httpOptions);
    }
    GetMprpadetailsBySearch(pofilters: PADetailsModel): Observable<any> {
        return this.http.post<any>(this.url + 'PA/getMprPaDetailsBySearch', pofilters, this.httpOptions)
    }
    LoadAllVendors(): Observable<any> {
        return this.http.get<any>(this.url + 'RFQ/GetAllvendorList', this.httpOptions);
    }
    LoadAllMappedSlabs(): Observable<any> {
        return this.http.get<any>(this.url + 'PA/GetAllMappedSlabs', this.httpOptions);
    }
} 
