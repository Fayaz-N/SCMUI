import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
//import { LoginComponent } from './Login/Login.component';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
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
import { LoginComponent } from './Login/Login.component';
import { AuthGuard } from '../common/auth.guard';

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
        { path: "Dashboard", component: DashboardComponent ,canActivate:[AuthGuard]},
        { path: "MPRDetails", component: MPRPageComponent,canActivate:[AuthGuard] },
        { path: "MPRDetails/:MPRRevisionId", component: MPRPageComponent,canActivate:[AuthGuard] },
        { path: "MPRList", component: MPRListComponent,canActivate:[AuthGuard] },
        { path: "MPRCheckerList", component: MPRListComponent,canActivate:[AuthGuard] },
        { path: "MPRApproverList", component: MPRListComponent,canActivate:[AuthGuard] },
        { path: 'GenerateRFQ/:MPRRevisionId', component: GenerateRFQComponent,canActivate:[AuthGuard] },
        { path: 'RFQComparision/:MPRRevisionId', component: RFQComparisionComponent,canActivate:[AuthGuard] },
          { path: 'Approvers', component: ApproversComponent,canActivate:[AuthGuard] },
          { path: 'Buyers', component: BuyerGroupsComponent,canActivate:[AuthGuard] },
          { path: 'Departments', component: DepartmentComponent,canActivate:[AuthGuard] },
          { path: 'Scopes', component: ScopesComponent,canActivate:[AuthGuard] },
          { path: 'ProcurementSource', component: ProcurementSourcesComponent,canActivate:[AuthGuard] },
          { path: 'Groupaccessibility', component: AccessGroupComponent,canActivate:[AuthGuard] },
          { path: 'Roleaccessibility', component: RoleAccessComponent,canActivate:[AuthGuard] },
          { path: 'Authorizationitem', component: AuthorizationItemComponent,canActivate:[AuthGuard] },
          { path: 'Viewaccess', component: ViewAccessComponent,canActivate:[AuthGuard] },
          { path: 'Configuration', component: ConfigComponent,canActivate:[AuthGuard] },
      

    
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
