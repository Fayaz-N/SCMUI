import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
//import { LoginComponent } from './Login/Login.component';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { MPRPageComponent } from './MPR/MPRPage.component';
import { MPRListComponent } from './MPR/MPRList.component';
import { SavingsReportComponent } from './MPR/SavingsReport.component';
import { GenerateRFQComponent } from './RFQ/GenerateRFQ.component';
import { RFQComparisionComponent } from './RFQ/RFQComparision.component'
import { ApproversComponent } from './MPR/Admin/Approvers.component';
import { BuyerGroupsComponent } from './MPR/Admin/BuyerGroups.component';
import { DepartmentComponent } from './MPR/Admin/Departments.component';
import { ScopesComponent } from './MPR/Admin/Scopes.component';
import { ProcurementSourcesComponent } from './MPR/Admin/ProcurementSources.component';
import { UploadVendorComponent } from './MPR/Admin/UploadVendors.component';
import { VendorEmailComponent } from './MPR/Admin/VendorEmail.component';
import { ProjectManagersComponent } from './MPR/Admin/ProjectManagers.component';
import { AccessGroupComponent } from './Authorization/AccessGroup.component';
import { RoleAccessComponent } from './Authorization/RoleAccess.component';
import { AuthorizationItemComponent } from './Authorization/AuthorizationItem.component';
import { ViewAccessComponent } from './Authorization/ViewAccess.component';
import { ConfigComponent } from './Authorization/Config.component';
import { LoginComponent } from './Login/Login.component';
import { AuthGuard } from '../common/auth.guard';
import { VendorQuotationViewComponent } from './RFQ/VendorQuotationView.component';
import { RFQFormComponent } from './RFQ/RFQForm.component';
import { RFQListComponent } from './RFQ/RFQList.component';
import { PurchaseAuthorizationDetailsComponent } from './purchase-authorization/PurchaseAuthorizationDetails.component';
import { PurchaseAuthorizationComponent } from './purchase-authorization/purchase-authorization.component';
import { CreditAuthorizationComponent } from './purchase-authorization/CreditAuthorization.component';
import { purchasePaymentComponent } from './purchase-authorization/purchasePayment.component';
import { purchasePaymentListComponent } from './purchase-authorization/purchasePaymentList.component';
import { MPRPAApproversListComponent } from './purchase-authorization/MPRPAApproversList.component';
import { AddSlabsComponent } from './purchase-authorization/AddSlabs.component';
import { MPRStatusChartComponent } from './Dashboard/MPRStatusChart.component';
import { PAReportListComponent } from './purchase-authorization/PAReportList.component';
import { PAIncompletedListComponent } from './purchase-authorization/PAIncompletedList.component';
import { TokuchuRequestComponent } from './purchase-authorization/Tokuchurequest.component';
import { TokuchuReqListComponent } from './purchase-authorization/TokuchuReqList.component';
import { VendorRegInitiateComponent } from './VendorRegistration/VendorRegInitiate';
import { VendorRegListComponent } from './VendorRegistration/VendorRegList'
import { VendorRegisterApproverComponent } from './VendorRegistration/VendorRegApprover.component'
import { MPRStatusReportsComponent } from './MPRReports/MPRStatusReports.component'
import { MPRWiseReportsComponent } from './MPRReports/MPRWiseReports.component'
import { MPRRequisitionWiseReportComponent } from './MPRReports/MPRRequisitionWiseReport.component'

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'Login',
      component: LoginComponent,
    },
    {
      path: '',
      redirectTo: 'Login',
      pathMatch: 'full',
    },
    { path: "Dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
    { path: "MPRForm", component: MPRPageComponent, canActivate: [AuthGuard] },
    { path: "MPRForm/:MPRRevisionId", component: MPRPageComponent, canActivate: [AuthGuard] },
    { path: "MPRList", component: MPRListComponent, canActivate: [AuthGuard] },
    { path: "MPRCheckerList", component: MPRListComponent, canActivate: [AuthGuard] },
    { path: "MPRApproverList", component: MPRListComponent, canActivate: [AuthGuard] },
    { path: "MPRPendingList", component: MPRListComponent, canActivate: [AuthGuard] },
    { path: "MPRSingleVendorList", component: MPRListComponent, canActivate: [AuthGuard] },
    { path: "SavingsReport", component: SavingsReportComponent, canActivate: [AuthGuard] },
    { path: "RFQForm", component: RFQFormComponent, canActivate: [AuthGuard] },
    { path: "RFQForm/:RFQRevisionId", component: RFQFormComponent, canActivate: [AuthGuard] },
    { path: "RFQList", component: RFQListComponent },
    { path: 'GenerateRFQ/:MPRRevisionId', component: GenerateRFQComponent, canActivate: [AuthGuard] },
    { path: 'RFQComparision/:MPRRevisionId', component: RFQComparisionComponent, canActivate: [AuthGuard] },
    { path: 'VendorQuoteView/:RFQRevisionId', component: VendorQuotationViewComponent },
    { path: 'Approvers', component: ApproversComponent, canActivate: [AuthGuard] },
    { path: 'Buyers', component: BuyerGroupsComponent, canActivate: [AuthGuard] },
    { path: 'Departments', component: DepartmentComponent, canActivate: [AuthGuard] },
    { path: 'Scopes', component: ScopesComponent, canActivate: [AuthGuard] },
    { path: 'ProcurementSource', component: ProcurementSourcesComponent, canActivate: [AuthGuard] },
    { path: 'UploadVendor', component: UploadVendorComponent, canActivate: [AuthGuard] },
    { path: 'VendorEmailTemplate', component: VendorEmailComponent, canActivate: [AuthGuard] },
    { path: 'ProjectManager', component: ProjectManagersComponent, canActivate: [AuthGuard] },
    { path: 'Groupaccessibility', component: AccessGroupComponent, canActivate: [AuthGuard] },
    { path: 'Roleaccessibility', component: RoleAccessComponent, canActivate: [AuthGuard] },
    { path: 'Authorizationitem', component: AuthorizationItemComponent, canActivate: [AuthGuard] },
    { path: 'Viewaccess', component: ViewAccessComponent, canActivate: [AuthGuard] },
    { path: 'Configuration', component: ConfigComponent, canActivate: [AuthGuard] },
    { path: "PADetails", component: PurchaseAuthorizationDetailsComponent, canActivate: [AuthGuard] },
    { path: "PADetails/:RevisionId", component: PurchaseAuthorizationDetailsComponent, canActivate: [AuthGuard] },
    { path: "EmployeeConfiguration", component: PurchaseAuthorizationComponent, canActivate: [AuthGuard] },
    { path: "AddSlab", component: AddSlabsComponent, canActivate: [AuthGuard] },
    { path: "CreditDays", component: CreditAuthorizationComponent, canActivate: [AuthGuard] },
    { path: "mprpa", component: purchasePaymentComponent, canActivate: [AuthGuard] },
    { path: "MPRPAList", component: purchasePaymentListComponent, canActivate: [AuthGuard] },
    { path: "mprpa/:PAId", component: purchasePaymentComponent, canActivate: [AuthGuard] },
    { path: "MPRPAApproverList", component: MPRPAApproversListComponent, canActivate: [AuthGuard] },
    { path: "MPRStatusChart", component: MPRStatusChartComponent, canActivate: [AuthGuard] },

    { path: "pareports", component: PAReportListComponent, canActivate: [AuthGuard] },
    { path: "incompletedpa", component: PAIncompletedListComponent, canActivate: [AuthGuard] },
    { path: "TokochuRequest", component: TokuchuRequestComponent, canActivate: [AuthGuard] },
    { path: "TokochuRequest/:TokuchRequestid", component: TokuchuRequestComponent, canActivate: [AuthGuard] },
    { path: "TokochuReqList", component: TokuchuReqListComponent, canActivate: [AuthGuard] },
    { path: "VendorRegInitiate", component: VendorRegInitiateComponent, canActivate: [AuthGuard] },
    { path: "VendorRegInitiate/:VendorId", component: VendorRegInitiateComponent, canActivate: [AuthGuard] },
    { path: "VendorRegList", component: VendorRegListComponent, canActivate: [AuthGuard] },
      { path: "VendorRegApprover", component: VendorRegisterApproverComponent, canActivate: [AuthGuard] },
      { path: "statusreport", component: MPRStatusReportsComponent, canActivate: [AuthGuard] },
      { path: "mprwisereport", component: MPRWiseReportsComponent, canActivate: [AuthGuard] },
      { path: "requisitionreport", component: MPRRequisitionWiseReportComponent, canActivate: [AuthGuard] }
    
    // {
    //      path: '',
    //      redirectTo: 'Login',
    //      pathMatch: 'full',
    // },

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
