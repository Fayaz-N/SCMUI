import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { YILTermsGroup, DynamicSearchResult, Employee, YILTermsandCondition } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service';
import { constants } from 'src/app/Models/MPRConstants';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-TermsAndConditions',
  templateUrl: './TermsAndConditions.component.html'

})

export class TermsAndConditionsComponent implements OnInit {

  constructor(private router: Router, public paService: purchaseauthorizationservice, public MprService: MprService, public constants: constants, private messageService: MessageService, private spinner: NgxSpinnerService) { }
  public employee: Employee;
  public buyergroups: any[];
  public YILTermsGroupList: Array<YILTermsGroup> = [];
  public YILTermsGroup: YILTermsGroup;
  public YILTermsandCondition: YILTermsandCondition;
  public ShowTermGroupDialog; ShowTermsAndConditionsDialog: boolean;

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");

    this.buyergroups = [];
    this.YILTermsGroupList = [];
    this.YILTermsGroup = new YILTermsGroup();
    this.YILTermsandCondition = new YILTermsandCondition();
    this.loadbuyergroups();
    this.GetYILTermGroups();
  }


  //get buyer groups
  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
      this.buyergroups = data;
    })
  }

  //Get YILterm groups with terms and conditions
  GetYILTermGroups() {
    this.spinner.show();
    this.MprService.GetYILTermGroups().subscribe(data => {
      this.spinner.hide();
      this.YILTermsGroupList = data;
    });
  }


  ShowTermGroupDialogBox(Details: any) {
    this.ShowTermGroupDialog = true;
    this.YILTermsGroup = new YILTermsGroup();
    if (Details) 
      this.YILTermsGroup = Details;
  }

  ShowTermsAndConditionsDialogBox(Details: any, termsDetails: any) {
    this.ShowTermsAndConditionsDialog = true;
    this.YILTermsandCondition = new YILTermsandCondition();
    this.YILTermsGroup = Details;
    if (termsDetails) {
      this.YILTermsandCondition = termsDetails;
    }
    else {
      this.YILTermsandCondition.BuyerGroupId = null;
      this.YILTermsandCondition.DefaultSelect = null;
      this.YILTermsandCondition.TermGroupId = Details.TermGroupId;
    }
  }

  Cancel(dialog: any) {
    this[dialog] = false;
  }

  //YIL terms groups  add/edit
  UpdateYILTermsGroup() {
    this.YILTermsGroup.CreatedBy = this.employee.EmployeeNo;
    this.spinner.show();
    this.MprService.UpdateYILTermsGroup(this.YILTermsGroup).subscribe(data => {
      this.spinner.hide();
      if (data) {
        this.GetYILTermGroups();
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Term  Group Updated' });
        this.ShowTermGroupDialog = false;
      }
    })
  }

  //YIL terms and conditions add/edit
  UpdateYILTermsAndConditions() {
    this.YILTermsandCondition.CreatedBy = this.employee.EmployeeNo;
    //this.YILTermsandCondition.DefaultSelect = this.YILTermsandCondition.DefaultSelect == 1 ? true : 0;
    this.spinner.show();
    this.MprService.UpdateYILTermsAndConditions(this.YILTermsandCondition).subscribe(data => {
      this.spinner.hide()
      if (data) {
        this.GetYILTermGroups();
        this.ShowTermsAndConditionsDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'YILTerms and Condition Updated' });
      }
    })
  }

  DeleteTermGroup(TermGroupId: any) {
    if (this.YILTermsGroupList.filter(li => li.TermGroupId == TermGroupId)[0].YILTermsandConditions.length > 0) {
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: "Before delete term group,Please delete terms and conditions" });
      return true;
    }
    this.spinner.show();
    this.MprService.DeleteTermGroup(TermGroupId, this.employee.EmployeeNo).subscribe(data => {
      this.spinner.hide()
      if (data) {
        this.GetYILTermGroups();
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Term Group Deleted' });
      }
    })
  }

  DeleteTermsAndConditions(TermId: any) {
    this.spinner.show();
    this.MprService.DeleteTermsAndConditions(TermId, this.employee.EmployeeNo).subscribe(data => {
      this.spinner.hide()
      if (data) {
        this.GetYILTermGroups();
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Term Group Deleted' });
      }
    })
  }
}
