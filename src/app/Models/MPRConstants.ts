import { Injectable } from '@angular/core';
import { searchParams } from '../Models/mpr';

@Injectable({
  providedIn: 'root'
}) 
export class constants {
  //public url = 'http://10.29.15.123:90/Api/';
  public url = 'http://localhost:49659/Api/';
  public dateFormat = "MM/dd/yyyy";
  public DepartmentId: searchParams = { tableName: 'MPRDepartments', fieldId: 'DepartmentId', fieldName: 'Department', condition: "", entityName:"MPRDepartment" };
  public ProjectManager: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m2' and ", entityName:"" };
  public ClientName: searchParams = { tableName: 'CustomerMasterYGS', fieldId: 'CustomerId', fieldName: 'CustomerName1', condition: "CustomerMasterTypeId=1 and ", entityName: "" };
  public BuyerGroupId: searchParams = { tableName: 'MPRBuyerGroups', fieldId: 'BuyerGroupId', fieldName: 'BuyerGroup', condition: "", entityName: "MPRBuyerGroup" };
  public ItemId: searchParams = { tableName: 'MaterialMaster', fieldId: 'ItemId', fieldName: 'ItemName', condition: "", entityName: "" };
  public venderid: searchParams = { tableName: 'VendorMaster', fieldId: 'Vendorid', fieldName: 'VendorName', condition: "", entityName: "" };
  public PurchaseTypeId: searchParams = { tableName: 'MPRPurchaseTypes', fieldId: 'PurchaseTypeId', fieldName: 'PurchaseType', condition: "", entityName: "" };
  public PreferredVendorTypeId: searchParams = { tableName: 'MPRPreferredVendorTypes', fieldId: 'PreferredVendorTypeId', fieldName: 'PreferredVendorType', condition: "", entityName: "" };
  public DispatchLocation: searchParams = { tableName: 'MPRDispatchLocations', fieldId: 'DispatchLocationId', fieldName: 'DispatchLocation', condition: "", entityName: "" };
  public ScopeId: searchParams = { tableName: 'MPRScopes', fieldId: 'ScopeId', fieldName: 'Scope', condition: "", entityName: "MPRScope" };

  public ProcurementSourceId: searchParams = { tableName: 'MPRProcurementSources', fieldId: 'ProcurementSourceId', fieldName: 'ProcurementSource', condition: "", entityName: "MPRProcurementSource" };
  public CustomsDutyId: searchParams = { tableName: 'MPRCustomsDuty', fieldId: 'CustomsDutyId', fieldName: 'CustomsDuty', condition: "", entityName: "MPRCustomsDuty"};
  public ProjectDutyApplicableId: searchParams = { tableName: 'MPRProjectDutyApplicable', fieldId: 'ProjectDutyApplicableId', fieldName: 'ProjectDutyApplicable', condition: "", entityName: "MPRProjectDutyApplicable"};
  public DocumentationDescriptionId: searchParams = { tableName: 'MPRDocumentationDescriptions', fieldId: 'DocumentationDescriptionId', fieldName: 'DocumentationDescription', condition: "", entityName: ""};
  public CheckedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade<'m2' and ", entityName: "" };
  public ApprovedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade>'m2' and ", entityName: ""};
  public Incharge: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", entityName: "" }
  public toEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", entityName: "" }
  public ccEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade='m1' and ", entityName: "" }
}

