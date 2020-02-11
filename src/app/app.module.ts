import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
import { ListboxModule } from 'primeng/listbox';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';
import { AppComponent } from './app.component';
//import { SideMenuComponent } from './Dashboard/SideMenu.component';
//import { DashboardComponent } from './Dashboard/Dashboard.component';
import { SidebarDirective } from './sidebar.directive';
import { MessageService } from 'primeng/api';
import { NgxSpinnerModule } from "ngx-spinner";
import { SelectfilterPipe } from './common/selectfilter.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './common/confirmationdialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import {MatExpansionModule} from '@angular/material/expansion';
import { ThemeModule } from './@theme/theme.module';
import { NbSidebarModule, NbMenuModule, NbDatepickerModule, NbDialogModule, NbWindowModule, NbToastrModule, NbChatModule } from '@nebular/theme';
import { CoreModule } from './@core/core.module';
//import { LoginComponent } from './Login/Login.component';


@NgModule({
  declarations: [
    AppComponent,
   //  LoginComponent,
    // SideMenuComponent,
    // DashboardComponent,
    // MPRPageComponent,
    // MPRListComponent,
    // GenerateRFQComponent,
    // RFQComparisionComponent,
    // ApproversComponent,
    // BuyerGroupsComponent,
    // DepartmentComponent,
    // ProcurementSourcesComponent,
    // ScopesComponent,
     SidebarDirective,
    // ConfigComponent,
    // AccessGroupComponent,
    // RoleAccessComponent,
    // AuthorizationItemComponent,
    // SelectfilterPipe,
    // ViewAccessComponent,
    // ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //ListViewModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgIdleKeepaliveModule.forRoot(),
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
    ThemeModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    NbMenuModule.forRoot()
  ],
  providers: [HttpClientModule, MessageService, ConfirmationService],
 // entryComponents: [ConfirmationDialogComponent,],
  bootstrap: [AppComponent]
})
export class AppModule { }
