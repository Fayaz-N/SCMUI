/// <reference path="mpr/admin/approvers.component.ts" />
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
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
import { DashboardComponent } from './dashboard/dashboard.component';
import { MPRPageComponent } from './MPR/MPRPage.component';
import { MPRListComponent } from './MPR/MPRList.component';
import { GenerateRFQComponent } from './RFQ/GenerateRFQ.component';
import { ApproversComponent } from './MPR/Admin/Approvers.component';
import { BuyerGroupsComponent } from './MPR/Admin/BuyerGroups.component';
import { DepartmentComponent } from './MPR/Admin/Departments.component';
import { ProcurementSourcesComponent } from './MPR/Admin/ProcurementSources.component';
import { ScopesComponent } from './MPR/Admin/Scopes.component';
import { SidebarDirective } from './sidebar.directive';
import { MessageService } from 'primeng/api';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MPRPageComponent,
    MPRListComponent,
    GenerateRFQComponent,
    ApproversComponent,
    BuyerGroupsComponent,
    DepartmentComponent,
    ProcurementSourcesComponent,
    ScopesComponent,
    SidebarDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //ListViewModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    NgxSpinnerModule
  ],
  providers: [HttpClientModule, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
