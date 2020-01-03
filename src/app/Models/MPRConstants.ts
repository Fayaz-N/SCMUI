import { Injectable } from '@angular/core';
import { searchParams } from '../Models/mpr';

@Injectable({
  providedIn: 'root'
}) 
export class constants {
  //public url = 'http://10.29.15.68:90/Api/';
  public url = 'http://localhost:49659/Api/';
  public dateFormat = "MM/dd/yyyy";
  public RequisitionId: string="";
  public DepartmentId: searchParams = { tableName: 'MPRDepartments', fieldId: 'DepartmentId', fieldName: 'Department', condition: "", fieldAliasName: "DepartmentName" };
  public ProjectManager: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m2' and ", fieldAliasName: "ProjectManagerName" };
  public ClientName: searchParams = { tableName: 'CustomerMasterYGS', fieldId: 'CustomerId', fieldName: 'CustomerName1', condition: "CustomerMasterTypeId=1 and ", fieldAliasName: "ClientName" };
  public BuyerGroupId: searchParams = { tableName: 'MPRBuyerGroups', fieldId: 'BuyerGroupId', fieldName: 'BuyerGroup', condition: "", fieldAliasName: "BuyerGroupName"};
  public ItemId: searchParams = { tableName: 'MaterialMasterYGS', fieldId: 'Material', fieldName: 'Materialdescription', condition: "", fieldAliasName: ""  };
  public UnitId: searchParams = { tableName: 'UnitMaster', fieldId: 'UnitId', fieldName: 'UnitName', condition: "", fieldAliasName: ""  };
  public venderid: searchParams = { tableName: 'VendorMaster', fieldId: 'Vendorid', fieldName: 'VendorName', condition: "", fieldAliasName: "" };
  public PurchaseTypeId: searchParams = { tableName: 'MPRPurchaseTypes', fieldId: 'PurchaseTypeId', fieldName: 'PurchaseType', condition: "", fieldAliasName: "PurchaseType" };
  public PreferredVendorTypeId: searchParams = { tableName: 'MPRPreferredVendorTypes', fieldId: 'PreferredVendorTypeId', fieldName: 'PreferredVendorType', condition: "", fieldAliasName: "PreferredVendorType"  };
  public DispatchLocation: searchParams = { tableName: 'MPRDispatchLocations', fieldId: 'DispatchLocationId', fieldName: 'DispatchLocation', condition: "", fieldAliasName: "DispatchLocation"};
  public ScopeId: searchParams = { tableName: 'MPRScopes', fieldId: 'ScopeId', fieldName: 'Scope', condition: "", fieldAliasName: "Scope" };

  public ProcurementSourceId: searchParams = { tableName: 'MPRProcurementSources', fieldId: 'ProcurementSourceId', fieldName: 'ProcurementSource', condition: "", fieldAliasName: "ProcurementSource" };
  public CustomsDutyId: searchParams = { tableName: 'MPRCustomsDuty', fieldId: 'CustomsDutyId', fieldName: 'CustomsDuty', condition: "", fieldAliasName: "CustomDuty"};
  public ProjectDutyApplicableId: searchParams = { tableName: 'MPRProjectDutyApplicable', fieldId: 'ProjectDutyApplicableId', fieldName: 'ProjectDutyApplicable', condition: "", fieldAliasName: "ProjectDutyApplicable"};
  public DocumentationDescriptionId: searchParams = { tableName: 'MPRDocumentationDescriptions', fieldId: 'DocumentationDescriptionId', fieldName: 'DocumentationDescription', condition: "", fieldAliasName: ""};
  public CheckedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade<'m2' and ", fieldAliasName: "CheckedName" };
  public ApprovedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade>'m2' and ", fieldAliasName: "ApproverName"};
  public Incharge: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", fieldAliasName: "" };
  public toEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", fieldAliasName: "" };
  public ccEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", fieldAliasName: "" };
  public JobCode: searchParams = { tableName: 'MPRRevisions', fieldId: 'JobCode', fieldName: 'JobCode', condition: "", fieldAliasName: "" };
  public ItemDescription: searchParams = { tableName: 'MPRItemInfo', fieldId: 'ItemDescription', fieldName: 'ItemDescription', condition: "", fieldAliasName: "" };
}

