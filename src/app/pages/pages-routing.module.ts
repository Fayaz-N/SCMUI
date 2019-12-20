import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
//import { LoginComponent } from './Login/Login.component';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MPRPageComponent } from './MPR/MPRPage.component';
import { MPRListComponent } from './MPR/MPRList.component';
import { GenerateRFQComponent } from './RFQ/GenerateRFQ.component';
import { RFQComparisionComponent } from './RFQ/RFQComparision.component'
import { ApproversComponent } from './MPR/Admin/Approvers.component';
import { BuyerGroupsComponent } from './MPR/Admin/BuyerGroups.component';
import { DepartmentComponent } from './MPR/Admin/Departments.component';
import { ScopesComponent } from './MPR/Admin/Scopes.component';
import { ProcurementSourcesComponent } from './MPR/Admin/ProcurementSources.component';
import { AccessGroupComponent } from './Authorization/AccessGroup.component';
import { RoleAccessComponent } from './Authorization/RoleAccess.component';
import { AuthorizationItemComponent } from './Authorization/AuthorizationItem.component';
import { ViewAccessComponent } from './Authorization/ViewAccess.component';
import { ConfigComponent } from './Authorization/Config.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
     

    },
    // {
    //      path: '',
    //      redirectTo: 'Login',
    //      pathMatch: 'full',
    // },
    { path: "MPRDetails", component: MPRPageComponent },
    { path: "MPRDetails/:MPRRevisionId", component: MPRPageComponent },
    { path: "MPRList", component: MPRListComponent },
    { path: "MPRCheckerList", component: MPRListComponent },
    { path: "MPRApproverList", component: MPRListComponent },
    { path: 'GenerateRFQ/:MPRRevisionId', component: GenerateRFQComponent },
    { path: 'RFQComparision/:MPRRevisionId', component: RFQComparisionComponent },
      { path: 'Approvers', component: ApproversComponent },
      { path: 'Buyers', component: BuyerGroupsComponent },
      { path: 'Departments', component: DepartmentComponent },
      { path: 'Scopes', component: ScopesComponent },
      { path: 'ProcurementSource', component: ProcurementSourcesComponent },
      { path: 'Groupaccessibility', component: AccessGroupComponent },
      { path: 'Roleaccessibility', component: RoleAccessComponent },
      { path: 'Authorizationitem', component: AuthorizationItemComponent },
      { path: 'Viewaccess', component: ViewAccessComponent },
      { path: 'Configuration', component: ConfigComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
