import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DynamicSearchResult, mprRevision, MPRItemInfoes, MPRDocument, MPRVendorDetail, MPRDocumentations, MPRStatusUpdate, mprFilterParams } from '../Models/mpr';
import { constants } from '../Models/MPRConstants'

@Injectable({
  providedIn: 'root'
})


export class RfqService {
  constructor(private http: HttpClient, private constants: constants) { }
  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  public url = this.constants.url;
  
  getRFQItems(MPRRevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/getRFQItems/' + MPRRevisionId);
  }

  updateVendorQuotes(vendorQuoteList: any, termsList: any): Observable<any> {
    var Data = {
      RFQQuoteViewList: vendorQuoteList,
      TermsList: termsList
    }
    return this.http.post<any>(this.url + 'RFQ/updateVendorQuotes', JSON.stringify(Data), this.httpOptions);
  }
  getRFQCompareItems(MPRRevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/getRFQCompareItems/' + MPRRevisionId);
  }
  statusUpdate(vendorList: any): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/rfqStatusUpdate/' + vendorList, this.httpOptions);
  }
}
