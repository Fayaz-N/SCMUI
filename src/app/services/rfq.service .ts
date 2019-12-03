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
  
  getRFQItems(RevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/getRFQItems/' + RevisionId);
  }

  updateVendorQuotes(vendorQuoteList: any): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/updateVendorQuotes', vendorQuoteList, this.httpOptions);
  }
}
