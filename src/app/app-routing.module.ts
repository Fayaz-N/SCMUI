import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { MPRPageComponent } from './MPR/MPRPage.component';
import { MPRListComponent } from './MPR/MPRList.component';
import { GenerateRFQComponent } from './RFQ/GenerateRFQ.component';
import { ApproversComponent } from './MPR/Admin/Approvers.component';
import { BuyerGroupsComponent } from './MPR/Admin/BuyerGroups.component';
import { DepartmentComponent } from './MPR/Admin/Departments.component';
import { ScopesComponent } from './MPR/Admin/Scopes.component';
import { ProcurementSourcesComponent } from './MPR/Admin/ProcurementSources.component';
import { LoginComponent } from './Login/Login.component';
import { RFQComparisionComponent } from './RFQ/RFQComparision.component';
import { SideMenuComponent } from './Dashboard/SideMenu.component';

const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: "Login", component: LoginComponent },
  {
    path: 'SCM',
    component: SideMenuComponent,
    children: [
      { path: "DashBoard", component: DashboardComponent },
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


    ]
  },
];



//{ path: "", component: MPRPageComponent },
//{ path: "mpr", component: MPRPageComponent },
//{ path: "mpr/:RevisionId", component: MPRPageComponent },
//{ path: "mprList", component: MPRListComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } export const
  RoutingComponent = [];
