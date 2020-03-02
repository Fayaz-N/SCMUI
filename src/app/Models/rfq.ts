import { VendorMaster } from './mpr';

export class rfqQuoteModel {
  RFQSplitItemId: number;
  MPRItemDetailsid: number;
  Itemdetailsid: number;
  ItemId: number;
  ItemName: string;
  MaterialDescription: string;
  ItemDescription: string;
  TargetSpend: string;
  MprQuantity: string;
  QuotationQty: string;
  vendorQuoteQty: string;
  UnitPrice: string;
  leastPrice: string;
  RfqDocStatus: string;
  Remarks: string;
  ActiveRevision: string;
  RateContract: number;
  PONumber: number;
  PODate: Date;
  POPrice: string;
  PORemarks: string;
  PONo: string;
  RFQNo: string;
  HSNCode: string;
  RFQType: string;
  suggestedVendorDetails: Array<any> = [];
  manualvendorDetails: Array<any> = [];
  repeatOrdervendorDetails: Array<any> = [];

}
export class RFQRevisionData {
  CreatedBy: number;
  CreatedDate: Date;
  RFQType: string;
  QuoteValidFrom: Date;
  QuoteValidTo: Date;
  RfqValidDate: number;
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
  VendorVisibility: boolean
  rfqmaster: RFQMasters;
  rfqitem: Array<RfqItemModel> = [];
}

export class VendorDetails {
  VendorCode: string;
  VendorName: string;
  OldvendorCode: string;
  RFQNo: string;
  MPRRevisionId: string;
  RfqMasterId: string;
  VendorId: number;
  rfqRevisionId: number;
  RFQValidDate: Date;
  DeliveryMinWeeks: number;
  DeliveryMaxWeeks: number;
  RFQItemsId: number;
  MPRItemsDetailsId: number;
  VendorQuoteQty: string;
  UnitPrice: string;
  DiscountPercentage: string;
  Discount: string;
  PaymentTermDays: number;
  PaymentTermRemarks: string;
  BankGuarantee: string;
  Freight: string;
  FreightAmount: string;
  PFAmount: string;
  TotalPrice: string;
  Insurance: string;
}
export class RfqItemInfoModel {
  RFQSplitItemId: number;
  RFQItemsId: number;
  StartQty: string;
  EndQty: string;
  Qty: string;
  UOM: number;
  UnitPrice: string;
  DiscountPercentage: string;
  Discount: string;
  CurrencyId: number;
  CurrencyValue: string;
  Remarks: string;
  DeliveryDate: Date;
  ValidFrom: Date;
  ValidTo: Date;
  Status: string;
  DeleteFlag: boolean;
  SyncDate: Date;
  SyncStatus: boolean;
  DeliveryDays: number;
  //item: RfqItemModel;
}
export class RFQMasters {
  RfqMasterId: number;
  MPRRevisionId: number;
  RFQNo: string;
  RFQUniqueNo: number;
  VendorId: number;
  VendorVisibility: boolean;
  CreatedBy: string;
  CreatedDate: Date;
  DeleteFlag: boolean;
  SyncDate: Date;
  SyncStatus: string;
  RFQRevisions: Array<RFQRevisionData> = [];
  Vendor: VendorMaster;
}
export class RFQCurrencyMaster {
  CurrencyId: number;
  CurrencyName: string;
  CurrencyCode: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  DeletedBy: string;
  DeletedDate: Date;
  DeleteFlag: boolean
  Isdeleted: boolean;
}
export class RFQUnitMasters {
  UnitID: number;
  UnitName: string;
  Isdeleted: boolean;
}
export class RfqItemModel {
  RFQItemsId: number;
  RFQRevisionId: number;
  MPRItemDetailsId: number;
  ItemId: string;
  ItemName: string;
  ItemDescription: string;
  QuotationQty: string;
  VendorModelNo: string;
  HSNCode: string;
  CustomDuty: string;
  FreightPercentage: string;
  FreightAmount: string;
  PFPercentage: string;
  PFAmount: string;
  IGSTPercentage: string;
  CGSTPercentage: string;
  SGSTPercentage: string;
  taxInclusiveOfDiscount: string;
  RequestRemarks: string;
  DeleteFlag: boolean;
  SyncDate: Date;
  SyncStatus: boolean;
  iteminfo: Array<RfqItemInfoModel> = [];
  RFQDocuments: Array<RFQDocuments> = [];
  MfgPartNo: string;
  MfgModelNo: string;

}

export class rfqFilterParams {
  RFQType: string;
  typeOfFilter: string;
  FromDate: string;
  ToDate: string;
  RFQNo: string;
  venderid: string;
  DocumentNo: string;
}
export class QuoteDetails {
  CreatedDate: Date;
  RfqValidDate: Date;
  rfqmaster: RFQMaster;
  rfqitem: Array<RfqItemModel>;
  RFQTerms: Array<any>;
  mprIncharges: Array<any>;
  rfqCommunications: Array<any>;
}
export class RFQMaster {
  RfqNo: string;
  RFQNo: string;
  Vendor: VendorDetails;
  MPRRevisionId: string;
}

export class RFQCommunication {
  RfqCCid: number;
  RfqItemsId: number;
  RfqRevisionId: number;
  RemarksTo: string = "";
  RemarksFrom: string;
  RemarksDate: Date;
  Remarks: string;
  DeleteFlag: boolean;
}

export class rfqTerms {
  Terms: string;
  RFQrevisionId: string;
  VendorResponse: string;
  Remarks: string;
  termsList: Array<any> = [];
}
export class RFQDocuments {
  RfqDocumentId: number;
  RfqRevisionId: number;
  RfqItemsId: number;
  DocumentName: string;
  DocumentType: number
  Path: string;
  UploadedBy: string
  UploadedDate: Date;
  StatusRemarks: string;
  Status: string;
  Statusdate: Date
  StatusBy: string;
  DeleteFlag: boolean;
}
export class PreviousPrice {
  PONumber: number;
  PODate: Date;
  POPrice: string;
  PORemarks: string;
}
