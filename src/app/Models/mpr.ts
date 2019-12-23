export class MPR {
}

export class DynamicSearchResult {
  connectionString: string;
  columnNames: string;
  columnValues: string;
  tableName: string;
  updateCondition: string;
  searchCondition: string;
  query: string;
  sortBy: string;
}
export class searchParams {
  tableName: string;
  fieldName: string;
  fieldId: string;
  condition: string;
  entityName: string;
}
export class searchList {
  listName: string;
  code: number;
  name: string;
}
export class MPRDetail {
  RequisitionId: number;
  DocumentNo: string;
  DocumentDescription: string;
}
export class MPRItemInfoes {
  Itemdetailsid: number;
  Itemid: number;
  RevisionId: number;
  ItemDescription: string;
  Quantity: string;
  UnitId: string;
  SaleOrderNo: string;
  SOLineItemNo: string;
  ReferenceDocNo: string;
  TargetSpend: string;
  DeleteFlag: boolean
}



export class MPRDocumentations {
  DocumentationId: number;
  RevisionId: number;
  DocumentationDescriptionId: number;
  DocumentationDescription: string
  NoOfSetsApproval: number;
  NoOfSetsFinal: number;
  MPRDocumentationDescription: any;
}
export class MPRDocument {
  MprDocId: number;
  RevisionId: number;
  ItemDetailsId: number;
  DocumentName: string;
  UploadedBy: string;
  UplaodedDate: Date
  Path: string;
  DocumentTypeid: number;
  Deleteflag: boolean

}
export class MPRIncharge {
  InchargeId: number;
  RequisitionId: number;
  RevisionId: number;
  Incharge: string;
  CanClearTechnically: boolean = false;
  CanClearCommercially: boolean = false;
  CanReceiveMailNotification: boolean = false;
  UpdatedBy: string;
  UpdatedDate: Date;
  DeleteFlag: boolean

}
export class MPRCommunication {
  MPRCCId: number;
  RevisionId: number;
  Remarks: string = "";
  RemarksFrom: string;
  SendEmail: boolean = false;
  SetReminder: boolean = false;
  ReminderDate: Date;
  RemarksDate: Date;
  DeleteFlag: boolean;
  MPRReminderTrackings: Array<MPRReminderTracking> = [];
}

export class MPRReminderTracking {
  ReminderId: number;
  MPRCCId: number;
  MailTo: string;
  MailAddressType: string
  MailSentOn: Date;
  AcknowledgedOn: Date;
  AcknowledgementRemarks: string;
  DeleteFlag: string;
}

export class MPRItemDetail {

}
export class MPRStatusTrack {

}
export class MPRTargetedSpendSupportingDoc {

}
export class MPRVendorDetail {
  VendorDetailsId: number;
  RevisionId: number;
  Vendorid: number;
  VendorName: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  RemovedBy: string;
  RemovedDate: Date;
  RemoveFlag: boolean
  VendorMaster: any;
}


export class mprRevision {

  MPRCommunications: Array<MPRCommunication> = [];
  MPRDocumentations: Array<MPRDocumentations> = [];
  MPRDocuments: Array<MPRDocument> = [];
  MPRIncharges: Array<MPRIncharge> = [];
  MPRItemInfoes: Array<MPRItemInfoes> = [];
  MPRStatusTracks: MPRStatusTrack;
  MPRTargetedSpendSupportingDocs: MPRTargetedSpendSupportingDoc;
  MPRVendorDetails: Array<MPRVendorDetail> = [];
  MPRDetail: MPRDetail;
  RequisitionId: number;
  DepartmentId: number;
  ProjectManager: string;
  JobCode: string;
  JobName: string;
  GEPSApprovalId: string;
  SaleOrderNo: string;
  LineItemNo: string;
  ClientName: string;
  PlantLocation: string;
  BuyerGroupId: number
  TargetedSpendAmount: string;
  TargetedSpendRemarks: string;
  BoolPreferredVendor: boolean
  JustificationForSinglePreferredVendor: string;
  DeliveryRequiredBy: Date;
  IssuePurposeId: number;
  DispatchLocation: string;
  ScopeId: number;
  TrainingRequired: boolean = false;
  TrainingManWeeks: number;
  TrainingRemarks: string;
  BoolDocumentationApplicable: boolean = false;
  GuaranteePeriod: string;
  NoOfSetsOfQAP: number;
  InspectionRequired: boolean = false;
  InspectionRequiredNew: number;
  InspectionComments: string;
  NoOfSetsOfTestCertificates: number;
  ProcurementSourceId: number;
  CustomsDutyId: number;
  ProjectDutyApplicableId: number;
  ExciseDutyReimbursableForBOs: boolean;
  SalesTaxReimbursableForBOs: boolean;
  VATReimbursableForBOs: boolean;
  ServiceTaxReimbursableForBOs: boolean;
  ExciseDutyReimbursableForBOsNew: number;
  SalesTaxReimbursableForBOsNew: number;
  VATReimbursableForBOsNew: number;
  ServiceTaxReimbursableForBOsNew: number;
  Remarks: string;
  PreparedBy: string;
  PreparedOn: Date;
  CheckedBy: string;
  CheckedOn: Date;
  CheckStatus: string;
  CheckerRemarks: string;
  ApprovedBy: string;
  ApprovedOn: Date;
  ApprovalStatus: string;
  ApproverRemarks: string;
  SecondApprover: string;
  SecondApprovedOn: Date;
  SecondApproversStatus: string;
  SecondApproverRemarks: string;
  ThirdApprover: string;
  ThirdApproverStatus: string;
  ThirdApproverStatusChangedOn: Date;
  ThirdApproverRemarks: string;
  PurchaseDetailsReadBy: string;
  PurchaseDetailsReadOn: Date;
  PurchasePersonnel: string;
  PODate: Date;
  ExpectedDespatchDate: Date
  PurchasePersonnelsComments: string;
  TechDocsReceivedDate: Date;
  CommercialOfferReceivedDate: Date;
  OfferDetailsMailedBy: string;
  OfferDetailsMailedOn: Date;
  OfferDetailsViewedByCheckerOn: Date;
  OfferDetailsViewedByApproverOn: Date;
  MaterialReceiptDate: Date;
  Remarks1: string;
  EstimatedCost: string;
  PreviousPOPrice: string
  PurchaseTypeId: number;
  PreferredVendorTypeId: number;
  StatusId: number;
  PurchaseCost: string;
  RevisionNo: number;
  RevisionId: number;
  BoolValidRevision: boolean;
}



export class MPRStatusUpdate {
  RevisionId: number;
  status: string = "Select";
  Remarks: string;
  typeOfuser: string;
}

export class mprFilterParams {
  DocumentNo: string;
  DocumentDescription: string;
  FromDate: Date;
  ToDate: Date;
  Status: string;
  CheckedBy: string = "";
  ApprovedBy: string = "";
}
export class MPRScope {
  ScopeId: number;
  Scope: string;
  BoolInUse: string;
}
export class MPRApprovers {
  EmployeeNo: string;
}

export class Employee {
  EmployeeNo: string;
  Name: string;
} 
export class MPRBuyerGroup {
  BuyerGroupId: number;
  BuyerGroup: string;
  BoolInUse: boolean;
}
export class MPRProcurementSources {
  ProcurementSourceId: number;
  ProcurementSource: string;
  BoolInUse: boolean;
}
export class Department {
  DepartmentId: number;
  Department: string;
  SecondApproverEmpNo: string;
  SecondApproverName: string;
  ThirdApproverEmpNo: string;
  ThirdApproverName: string;
  BoolInUse: boolean;
}


export class ProjectManager {
  EmployeeNo: string;
  Name: string;
}




