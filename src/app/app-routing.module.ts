import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
//import { DashboardComponent } from './Dashboard/Dashboard.component';
//import { LoginComponent } from './Login/Login.component';

//import { LoginComponent } from './pages/Login/Login.component';

//import { config } from 'rxjs';

const routes: Routes = [
  {
    path: 'SCM',
    loadChildren: ()=>import('./pages/pages.module')
    .then(m=>m.PagesModule),
  },
  // { path: '', redirectTo: 'Login', pathMatch: 'full' },
  // { path: "Login", component: LoginComponent },
  // {
  //   path: 'SCM',
  //   component: SideMenuComponent,
  //   children: [
  //     { path: "DashBoard", component: DashboardComponent },
  //     { path: "MPRDetails", component: MPRPageComponent },
  //     { path: "MPRDetails/:MPRRevisionId", component: MPRPageComponent },
  //     { path: "MPRList", component: MPRListComponent },
  //     { path: "MPRCheckerList", component: MPRListComponent },
  //     { path: "MPRApproverList", component: MPRListComponent },
  //     { path: 'GenerateRFQ/:MPRRevisionId', component: GenerateRFQComponent },
  //     { path: 'RFQComparision/:MPRRevisionId', component: RFQComparisionComponent },
  //     { path: 'Approvers', component: ApproversComponent },
  //     { path: 'Buyers', component: BuyerGroupsComponent },
  //     { path: 'Departments', component: DepartmentComponent },
  //     { path: 'Scopes', component: ScopesComponent },
  //     { path: 'ProcurementSource', component: ProcurementSourcesComponent },
  //     { path: 'Groupaccessibility', component: AccessGroupComponent },
  //     { path: 'Roleaccessibility', component: RoleAccessComponent },
  //     { path: 'Authorizationitem', component: AuthorizationItemComponent },
  //     { path: 'Viewaccess', component: ViewAccessComponent },
  //     { path: 'Configuration', component: ConfigComponent },


  //   ]
  // },

  {
    path:'',redirectTo:'SCM',pathMatch:'full'},
    {path:'**',redirectTo:'SCM'},
   
  
];
const config: ExtraOptions={
  useHash:false,
  onSameUrlNavigation:'reload'
};



//{ path: "", component: MPRPageComponent },
//{ path: "mpr", component: MPRPageComponent },
//{ path: "mpr/:RevisionId", component: MPRPageComponent },
//{ path: "mprList", component: MPRListComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes,config)],
  exports: [RouterModule]
})
export class AppRoutingModule { } //export const
 // RoutingComponent = [];
