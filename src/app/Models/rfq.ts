export class rfqQuoteModel {
  MPRItemDetailsid: number;
  ItemId: number;
  ItemName: string;
  ItemDescription: string;
  TargetSpend: string;
  QuotationQty: string;
  vendorDetails: Array<any> = [];

}

//export class Vendordetails {
//  VendorCode: string;
//  VendorName: string;
//  OldvendorCode: string;
//  RFQNo: string;
//  MPRRevisionId: string;
//  RfqMasterId: string;
//  VendorId: number;
//  rfqRevisionId: number;
//  RFQValidDate: Date;
//  DeliveryMinWeeks: number;
//  DeliveryMaxWeeks: number;
//  RFQItemsId: number;
//  MPRItemsDetailsId: number;
//  VendorQuoteQty: string;
//  UnitPrice: string;
//  DiscountPercentage: string;
//  Discount: string;
//}
