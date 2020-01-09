import { NumberValueAccessor } from '@angular/forms';

export class PAAuthorizationLimitModel {
    Authid: number;
    DeptId: number;
    MinPAValue: number;
    MaxPAValue: number;
    AuthorizationType: string;
    DeleteFlag: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    DeletedBY: string;
    DeletedDate: Date;
    PAAuthorizationEmployeeMappings: Array<PAAuthorizationEmployeeMappingModel>[];
    PACreditDaysApprovers: Array<PACreditDaysApproverModel>[];
}
export class PAAuthorizationEmployeeMappingModel {
    PAmapid: number;
    Authid: number;
    Employeeid: string;
    FunctionalRoleId: string;
    Employeename: string;
    LessBudget: boolean;
    MoreBudget: boolean;
    AuthLevel: string;
    DeleteFlag: boolean;
    CreatedBY: string;
    CreatedDate: Date;
    DeletedBy: string;
    DeletedDate: Date;
    checked: string;
}
export class PACreditDaysApproverModel {
    CRApprovalid: number;
    Authid: number;
    EmployeeNo: string;
    CreditDaysid: number;
    Createdby: string;
    CreatedDate: Date;
    DeleteFlag: boolean;
    DeletedBy: string;
    DeletedDate: Date;
}
export class PACreditDaysMasterModel {
    CreditDaysid: number;
    MinDays: string;
    MaxDays: string;
    CreatedBy: string;
    CreatedDate: Date;
    DeleteFlag: boolean;
    DeletedBy: string;
    DeletedDate: Date;
}
export class PADetailsModel {
    VendorId: number;
    RequisitionID: number;
    DocumentNumber: number;
    RevisionID: number;
    SaleOrderNo: string;
    BuyerGroupId: number;
    RFQNo: string;
    DeptID: number;
    DepartmentName: string;
}
export class ItemsViewModel {
    ItemDescription: string;
    DocumentyNo: string;
    QuotationQty: string;
    VendorName: string;
    TargetSpend: number;
    UnitPrice: number;
    SaleOrderNo: string;
    PaymentTermCode: string;
    selectAll: boolean;
    DepartmentId: number;
    EmployeeNo: number;
    Name: string;
}
export class EmployeeModel {
    EmployeeNo: number;
    Name: string;
}
export class ConfigurationModel {
    minvalue: number;
    maxvalue: number;
}
export class ChangedModel {
    selectedDepartment: number;
    department: string;
}
export class DepartmentModel {
    DepartmentID: number;
    DepartmentName: string;
}
export class mprpapurchasetypesmodel {
    PurchaseTypeId: number;
    PurchaseType: string;
    XOrder: number;
}
export class mprpapurchasemodesmodel {
    PurchaseModeId: number;
    PurchaseMode: string;
    XOrder: number;
}
export class mprpadetailsmodel {
    PAId: number;
    RequestedBy: string;
    RequestedOn: Date;
    PurchaseTypeId: number;
    PurchaseModeId: number;
    BuyerGroupId: number;
    DepartmentID: number;
    ProjectName: string;
    ProjectCode: string;
    TargetedSpendAmount: number;
    PurchaseCost: number;
    PackagingForwarding: string;
    Taxes: string;
    Freight: string;
    Insurance: string;
    DeliveryCondition: string;
    ShipmentMode: string;
    PaymentTerms: string;
    CreditDays: number;
    Warranty: string;
    BankGuarantee: string;
    LDPenaltyTerms: string;
    SpecialInstructions: string;
    FactorsForImports: string;
    SpecialRemarks: string;
    SupplierReference: string;
    purchasemodes: mprpapurchasemodesmodel;
    purchasetypes: mprpapurchasetypesmodel;
    department: DepartmentModel;
    Item: ItemsViewModel;
}
