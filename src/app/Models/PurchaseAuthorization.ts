import { NumberValueAccessor } from '@angular/forms';
import { Data } from '@angular/router';

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
    EmployeeNo: string;
}
export class ItemsViewModel {
    RFQItemsId: number;
    ItemDescription: string;
    Department: string;
    DocumentNo: string;
    QuotationQty: number;
    VendorId: number;
    VendorName: string;
    TargetSpend: number;
    UnitPrice: number;
    SaleOrderNo: string;
    PaymentTermCode: string;
    selectAll: boolean;
    DepartmentId: number;
    itemsum: number;
    EmployeeNo: number;
    Name: string;
    sum: number;
    TragetSpend: number;
    PONO: string;
    POItemNo: string;
    PODate: Date;
    Remarks: string;
    paitemid: number;
    paid: number;
}
export class EmployeeModel {
    EmployeeNo: number;
    Name: string;
    BuyerGroupManager: string;
    BuyerGroupNo: string;
    BGRole: string;
    PMRole: string;
    ProjectManager: string;
    ProjectMangerNo: string;
    Vendor: Array<VendorMasterModel>[];
    Approvers: Array<PurchaseCreditApproversModel>[];
}
export class PurchaseCreditApproversModel {
    ApproverName: string
    AuthorizationType: string
    RoleName: string;
    EmployeeNo: string;
    RoleId: string;
    ApproverLevel: number;
    ApproversRemarks: string;
    ApprovalStatus: string;
    ApprovedOn: Date;
    Approver: string;
    ApproverId: number;
    PAId: number;
}

export class ConfigurationModel {
    minvalue: number;
    maxvalue: number;
    PAValue: number;
    Creditdays: number;
    Budgetvalue: number;
    DeptId: number;
    TargetSpend: number;
    UnitPrice: number;
    PaymentTermCode: string
    MPRItemDetailsid: Array<number>[];
}
export class ChangedModel {
    selectedDepartment: number;
    department: string;
}
export class DepartmentModel {
    DepartmentID: number;
    DepartmentName: string;
    Department: string;
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
    UnitPrice: number;
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
    TermId: Array<number>[];
    purchasemodes: mprpapurchasemodesmodel;
    purchasetypes: mprpapurchasetypesmodel;
    department: DepartmentModel;
    Item: Array<ItemsViewModel>[];
    buyergroup: BuyerGroupModel;
    ApproversList: Array<MPRPAApproversModel>[];
}
export class MPRPAApproversModel {
    ApproverId: number;
    ApproverLevel: number;
    RoleName: string;
    ApproverName: string;
    ApproversRemarks: string;
    ApprovalStatus: string;
    ApprovedOn: Date;
    RoleId: string;
    EmployeeNo: string;
    PAId: number;
}
export class BuyerGroupModel {
    BuyerGroupId: number;
    BuyerGroup: string;
}
export class EmployeemappingtocreditModel {
    Authid: number;
    MinPAValue: number;
    MaxPAValue: number;
    DeptId: number;
    EmployeeNo: number;
    Name: string;
    AuthorizationType: string;
    CreditdaysId: number;
    MinDays: number;
    MaxDays: number;
}
export class ApproverInputModel {
    DeptId: number;
    itemsum: number;
    TargetSpend: number;
    UnitPrice: number;
}
export class ProjectManager {
    EmployeeNo: string;
    Name: string;
}
export class VendorMasterModel {
    VendorName: string;
    Vendorid: number;
}
export class PAApproverDetailsInputModel {
    Paid: number;
    FromDate: Date;
    ToDate: Date;
    Status: string;
    CreatedBy: string;
}
