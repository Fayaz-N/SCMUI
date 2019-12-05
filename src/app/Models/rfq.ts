export class rfqQuoteModel {
  MPRItemDetailsid: number;
  ItemId: number;
  ItemName: string;
  ItemDescription: string;
  TargetSpend: string;
  QuotationQty: string;
  vendorQuoteQty: string;
  suggestedVendorDetails: Array<any> = [];
  manualvendorDetails: Array<any> = [];

}
export class RFQRevisionData {
  CreatedBy: number;
  CreatedDate: Date;
  RfqValidDate: Date;
  PackingForwading: string;
  ExciseDuty: string;
  salesTax: string;
  freight: string;
  Insurance: string;
  CustomsDuty: string;
  ShipmentModeId: number;
  PaymentTermDays: number;
  PaymentTermRemarks: string;
  BankGuarantee: string;
  DeliveryMinWeeks: number;
  DeliveryMaxWeeks: number;
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
