import { Injectable } from '@angular/core';
import { searchParams, AccessList } from '../Models/mpr';

@Injectable({
  providedIn: 'root'
})
export class constants {
  public url = 'http://10.29.15.68:90/Api/';
  //public url = 'http://localhost:49659/Api/';

  public dateFormat = "MM/dd/yyyy";
  public RequisitionId: string = "";
  public rfqValidDays: number = 7;

  public DepartmentId: searchParams = { tableName: 'MPRDepartments', fieldId: 'DepartmentId', fieldName: 'Department', condition: " BoolInUse=1 and ", fieldAliasName: "DepartmentName", updateColumns: "" };
  public ProjectManager: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "DOL IS NULL and  ((Grade IN(SELECT Grades.Grade FROM Grades WHERE (Grades.Hierarchy>=(SELECT Grades.Hierarchy FROM Grades WHERE Grades.Grade='M2')))))  and ", fieldAliasName: "ProjectManagerName", updateColumns: "" };
  public ClientName: searchParams = { tableName: 'CustomerMasterYGS', fieldId: 'CustomerId', fieldName: 'CustomerName1', condition: "CustomerMasterTypeId=1 and ", fieldAliasName: "ClientName", updateColumns: "" };
  public BuyerGroupId: searchParams = { tableName: 'MPRBuyerGroups', fieldId: 'BuyerGroupId', fieldName: 'BuyerGroup', condition: "", fieldAliasName: "BuyerGroupName", updateColumns: "" };
  public ItemId: searchParams = { tableName: 'MaterialMasterYGS', fieldId: 'Material', fieldName: 'Materialdescription', condition: "", fieldAliasName: "", updateColumns: "" };
  public UnitId: searchParams = { tableName: 'UnitMaster', fieldId: 'UnitId', fieldName: 'UnitName', condition: "", fieldAliasName: "", updateColumns: "" };
  public venderid: searchParams = { tableName: 'VendorMaster', fieldId: 'Vendorid', fieldName: 'VendorName', condition: " Deleteflag=1 and ", fieldAliasName: "", updateColumns: "Emailid" };
  public PurchaseTypeId: searchParams = { tableName: 'MPRPurchaseTypes', fieldId: 'PurchaseTypeId', fieldName: 'PurchaseType', condition: "", fieldAliasName: "PurchaseType", updateColumns: "" };
  public PreferredVendorTypeId: searchParams = { tableName: 'MPRPreferredVendorTypes', fieldId: 'PreferredVendorTypeId', fieldName: 'PreferredVendorType', condition: "", fieldAliasName: "PreferredVendorType", updateColumns: "" };
  public DispatchLocation: searchParams = { tableName: 'MPRDispatchLocations', fieldId: 'DispatchLocationId', fieldName: 'DispatchLocation', condition: "", fieldAliasName: "DispatchLocation", updateColumns: "" };
  public ScopeId: searchParams = { tableName: 'MPRScopes', fieldId: 'ScopeId', fieldName: 'Scope', condition: "", fieldAliasName: "Scope", updateColumns: "" };

  public ProcurementSourceId: searchParams = { tableName: 'MPRProcurementSources', fieldId: 'ProcurementSourceId', fieldName: 'ProcurementSource', condition: "", fieldAliasName: "ProcurementSource", updateColumns: "" };
  public CustomsDutyId: searchParams = { tableName: 'MPRCustomsDuty', fieldId: 'CustomsDutyId', fieldName: 'CustomsDuty', condition: "", fieldAliasName: "CustomDuty", updateColumns: "" };
  //public ProjectDutyApplicableId: searchParams = { tableName: 'MPRProjectDutyApplicable', fieldId: 'ProjectDutyApplicableId', fieldName: 'ProjectDutyApplicable', condition: "", fieldAliasName: "ProjectDutyApplicable", updateColumns: "" };
  public DocumentationDescriptionId: searchParams = { tableName: 'MPRDocumentationDescriptions', fieldId: 'DocumentationDescriptionId', fieldName: 'DocumentationDescription', condition: "", fieldAliasName: "", updateColumns: "" };
  public CheckedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade<'m2' and ", fieldAliasName: "CheckedName", updateColumns: "" };
  public ApprovedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade>'m2' and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public Incharge: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", fieldAliasName: "", updateColumns: "" };
  public toEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", fieldAliasName: "", updateColumns: "" };
  public ccEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", fieldAliasName: "", updateColumns: "" };
  public JobCode: searchParams = { tableName: 'MPRRevisions', fieldId: 'JobCode', fieldName: 'JobCode', condition: "", fieldAliasName: "", updateColumns: "" };
  public ItemDescription: searchParams = { tableName: 'MPRItemInfo', fieldId: 'ItemDescription', fieldName: 'ItemDescription', condition: "", fieldAliasName: "", updateColumns: "" };
}

