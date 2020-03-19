import { Injectable } from '@angular/core';
import { searchParams, AccessList } from '../Models/mpr';

@Injectable({
  providedIn: 'root'
})
export class constants {
  public url = 'http://localhost:49659/Api/';
  //public url = 'http://10.29.15.183:90/Api/';

  public accessTokenUrl = "http://10.29.15.183:90/token";
  //public accessTokenUrl = "http://localhost:49659/token";
  public dateFormat = "dd/MM/yyyy";
  public RequisitionId: string = "";
  public rfqValidDays: number = 7;
  public Documnentpath = "http://10.29.15.183:90/SCMDocs/";
  public vendorDocumentPath = "http://10.29.15.183:90/SCMDocs/";

  public DepartmentId: searchParams = { tableName: 'MPRDepartments', fieldId: 'DepartmentId', fieldName: 'Department', condition: " where BoolInUse=1 and ", fieldAliasName: "DepartmentName", updateColumns: "" };
  public ProjectManager: searchParams = { tableName: 'ProjectManagers', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where ", fieldAliasName: "ProjectManagerName", updateColumns: "" };
  public vendorProjectManager: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where Employee.EmployeeNo  in(select ProjectManager from MPRRevisions  where BoolValidRevision=1) and ", fieldAliasName: "ProjectManagerName", updateColumns: "" };
  public ClientName: searchParams = { tableName: 'CustomerMasterYGS', fieldId: 'CustomerId', fieldName: 'CustomerName1', condition: " where CustomerMasterTypeId=1 and ", fieldAliasName: "ClientName", updateColumns: "" };
  public BuyerGroupId: searchParams = { tableName: 'MPRBuyerGroups', fieldId: 'BuyerGroupId', fieldName: 'BuyerGroup', condition: " where ", fieldAliasName: "BuyerGroupName", updateColumns: "" };
  public ItemId: searchParams = { tableName: 'MaterialMasterYGS', fieldId: 'Material', fieldName: 'Materialdescription', condition: " where ", fieldAliasName: "", updateColumns: "" };
  public UnitId: searchParams = { tableName: 'UnitMaster', fieldId: 'UnitId', fieldName: 'UnitName', condition: " where ", fieldAliasName: " where ", updateColumns: "" };
  public venderid: searchParams = { tableName: 'VendorMaster', fieldId: 'Vendorid', fieldName: 'VendorName', condition: " where  Deleteflag=1 and ", fieldAliasName: "", updateColumns: "Emailid" };
  public PurchaseTypeId: searchParams = { tableName: 'MPRPurchaseTypes', fieldId: 'PurchaseTypeId', fieldName: 'PurchaseType', condition: " where ", fieldAliasName: "PurchaseType", updateColumns: "" };
  public PreferredVendorTypeId: searchParams = { tableName: 'MPRPreferredVendorTypes', fieldId: 'PreferredVendorTypeId', fieldName: 'PreferredVendorType', condition: " where ", fieldAliasName: "PreferredVendorType", updateColumns: "" };
  public DispatchLocation: searchParams = { tableName: 'MPRDispatchLocations', fieldId: 'DispatchLocationId', fieldName: 'DispatchLocation', condition: " where ", fieldAliasName: "DispatchLocation", updateColumns: "" };
  public ScopeId: searchParams = { tableName: 'MPRScopes', fieldId: 'ScopeId', fieldName: 'Scope', condition: " where ", fieldAliasName: "Scope", updateColumns: " where " };

  public ProcurementSourceId: searchParams = { tableName: 'MPRProcurementSources', fieldId: 'ProcurementSourceId', fieldName: 'ProcurementSource', condition: " where BoolInUse=1 and ", fieldAliasName: "ProcurementSource", updateColumns: "" };
  public CustomsDutyId: searchParams = { tableName: 'MPRCustomsDuty', fieldId: 'CustomsDutyId', fieldName: 'CustomsDuty', condition: " where ", fieldAliasName: "CustomDuty", updateColumns: "" };
  //public ProjectDutyApplicableId: searchParams = { tableName: 'MPRProjectDutyApplicable', fieldId: 'ProjectDutyApplicableId', fieldName: 'ProjectDutyApplicable', condition: "", fieldAliasName: "ProjectDutyApplicable", updateColumns: "" };
  public DocumentationDescriptionId: searchParams = { tableName: 'MPRDocumentationDescriptions', fieldId: 'DocumentationDescriptionId', fieldName: 'DocumentationDescription', condition: " where ", fieldAliasName: "", updateColumns: "" };
  public CheckedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where DOL IS NULL and ", fieldAliasName: "CheckedName", updateColumns: "" };
  //public ApprovedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade>'m2' and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public ApprovedBy: searchParams = { tableName: 'MPRApproversView', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where ", fieldAliasName: "ApproverName", updateColumns: "" };
  public Incharge: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where Grade='m1' and DOL IS NULL and ", fieldAliasName: "", updateColumns: "" };
  public toEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where DOL IS NULL and ", fieldAliasName: "", updateColumns: "" };
  public ccEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where DOL IS NULL and ", fieldAliasName: "", updateColumns: "" };
  public JobCode: searchParams = { tableName: 'MPRRevisions', fieldId: 'JobCode', fieldName: 'JobCode', condition: " where ", fieldAliasName: "", updateColumns: "" };
  public ItemDescription: searchParams = { tableName: 'MPRItemInfo', fieldId: 'ItemDescription', fieldName: 'ItemDescription', condition: " where ", fieldAliasName: "", updateColumns: "" };
  public AssignEmployee: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where EmployeeNo in(select GroupMember from MPRBuyerGroupMembers) and DOL IS NULL and ", fieldAliasName: "", updateColumns: "" };
  public OCheckedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where Grade<'m2' and  employeeNo in (190271,220017,030011) and ", fieldAliasName: "CheckedName", updateColumns: "" };
  public OApprovedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where employeeNo in (190271,220017,030011) and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public OSecondApprover: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where employeeNo in (190271,220017,030011) and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public OThirdApprover: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where employeeNo in (190271,220017,030011) and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public MPRStatus: searchParams = { tableName: 'MPRStatus', fieldId: 'StatusId', fieldName: 'Status', condition: " where  ManualStatus=1 and BoolInUse=1 and ", fieldAliasName: "", updateColumns: "" };
  public MPRStatusId: searchParams = { tableName: 'MPRStatus', fieldId: 'StatusId', fieldName: 'Status', condition: "  where ManualStatus=1 and BoolInUse=1 and ", fieldAliasName: "", updateColumns: "" };

}

