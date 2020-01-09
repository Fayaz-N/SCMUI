import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './Dashboard/Dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { AccessGroupComponent } from './Authorization/AccessGroup.component';
import { ConfirmationDialogComponent } from '../common/confirmationdialog/confirmation-dialog.component';
import { AuthorizationItemComponent } from './Authorization/AuthorizationItem.component';
import { ConfigComponent } from './Authorization/Config.component';
import { RoleAccessComponent } from './Authorization/RoleAccess.component';
//import { LoginComponent } from './Login/Login.component';
import { ViewAccessComponent } from './Authorization/ViewAccess.component';
import { MPRListComponent } from './MPR/MPRList.component';
import { RFQListComponent } from './RFQ/RFQList.component';
import { VendorQuotationListComponent } from './RFQ/VendorQuotationList.component';
import { ApproversComponent } from './MPR/Admin/Approvers.component';
import { BuyerGroupsComponent } from './MPR/Admin/BuyerGroups.component';
import { DepartmentComponent } from './MPR/Admin/Departments.component';
import { ProcurementSourcesComponent } from './MPR/Admin/ProcurementSources.component';
import { ScopesComponent } from './MPR/Admin/Scopes.component';
import { ProjectManagersComponent } from './MPR/Admin/ProjectManagers.component';
import { MPRPageComponent } from './MPR/MPRPage.component';
import { GenerateRFQComponent } from './RFQ/GenerateRFQ.component';
import { RFQComparisionComponent } from './RFQ/RFQComparision.component';
import { VendorQuotationViewComponent } from './RFQ/VendorQuotationView.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DataViewModule } from 'primeng/dataview';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatDialogModule, MatButtonModule, MatExpansionModule } from '@angular/material';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectfilterPipe } from '../common/selectfilter.pipe';
import { LoginComponent } from './Login/Login.component';
import { PurchaseAuthorizationDetailsComponent } from './purchase-authorization/PurchaseAuthorizationDetails.component';
import { purchasePaymentComponent } from './purchase-authorization/purchasePayment.component';
import { PurchaseAuthorizationComponent } from './purchase-authorization/purchase-authorization.component';
import { CreditAuthorizationComponent } from './purchase-authorization/CreditAuthorization.component';
import { purchasePaymentListComponent } from './purchase-authorization/purchasePaymentList.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    FormsModule ,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ListboxModule,
    DialogModule,
    FileUploadModule,
    TooltipModule,
    RadioButtonModule,
    InputSwitchModule,
    CheckboxModule,
    CalendarModule,
    DataViewModule,
    ToastModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    MatDialogModule,
    MatButtonModule,
    ConfirmDialogModule,
    MatExpansionModule,
    NbMenuModule

  ],
  declarations: [
    PagesComponent,
    AccessGroupComponent,
    AuthorizationItemComponent,
    ConfigComponent,
    RoleAccessComponent,
    LoginComponent,
    ViewAccessComponent,
    MPRListComponent,
    RFQListComponent,
    VendorQuotationListComponent,
    ApproversComponent,
    BuyerGroupsComponent,
    DepartmentComponent,
    ProcurementSourcesComponent,
    ScopesComponent,
    ProjectManagersComponent,
    MPRPageComponent,
    GenerateRFQComponent,
    RFQComparisionComponent,
    VendorQuotationViewComponent,
    ConfirmationDialogComponent,
    SelectfilterPipe,
      PurchaseAuthorizationDetailsComponent,
      purchasePaymentComponent,
      PurchaseAuthorizationComponent,
      CreditAuthorizationComponent,
      purchasePaymentListComponent
    
  ],
  providers:[MessageService, ConfirmationService],
  entryComponents:[ConfirmationDialogComponent]
})
export class PagesModule {
}
