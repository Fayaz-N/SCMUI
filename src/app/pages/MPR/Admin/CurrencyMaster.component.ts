import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { YILTermsGroup, DynamicSearchResult, Employee, YILTermsandCondition } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { RFQCurrencyMaster } from 'src/app/Models/rfq';
import { RfqService } from 'src/app/services/rfq.service ';

@Component({
  selector: 'app-CurrencyMasterComponent',
  templateUrl: './CurrencyMaster.component.html'

})

export class CurrencyMasterComponent implements OnInit {

  constructor(private router: Router, public rfqservice: RfqService, public constants: constants, private messageService: MessageService, private spinner: NgxSpinnerService) { }
  public employee: Employee;

  public CurrencyMasterList: Array<RFQCurrencyMaster> = [];
  public CurrencyMaster: RFQCurrencyMaster;
  public ShowCurrencyDialog; AddCurrency: boolean;

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");

    this.CurrencyMasterList = [];
    this.CurrencyMaster = new RFQCurrencyMaster();

    this.GetAllCurrencyMaster();
  }



  //Get All currencymaster List
  GetAllCurrencyMaster() {
    this.spinner.show();
    this.rfqservice.GetAllMasterCurrency().subscribe(data => {
      this.spinner.hide();
      this.CurrencyMasterList = data;
    });
  }


  ShowCurrencyDialogBox(Details: any) {
    this.ShowCurrencyDialog = true;
    this.CurrencyMaster = new RFQCurrencyMaster();
    this.AddCurrency = true;
    if (Details) {
      this.AddCurrency = false;
      this.CurrencyMaster = Details;
    }
  }


  Cancel(dialog: any) {
    this[dialog] = false;
  }

  //Currency master  add/edit
  UpdateCurrency() {
    if (this.CurrencyMaster.CurrencyName && this.CurrencyMaster.CurrencyCode) {
      if (this.AddCurrency && this.CurrencyMasterList.filter(li => li.CurrencyName == this.CurrencyMaster.CurrencyName).length > 0) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Currency Name Already Exist' });
        return;
      }
      this.CurrencyMaster.UpdatedBy = this.employee.EmployeeNo;
      this.CurrencyMaster.DeletedBy = this.employee.EmployeeNo;
      this.spinner.show();
      this.rfqservice.UpdateNewCurrencyMaster(this.CurrencyMaster).subscribe(data => {
        this.spinner.hide();
        if (data) {
          this.CurrencyMasterList = data;
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Currency Updated' });
          this.ShowCurrencyDialog = false;
        }
      })
    }
    else {
      if (!this.CurrencyMaster.CurrencyName)
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Currency Name' });
      if (!this.CurrencyMaster.CurrencyCode)
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Currency Code' });
    }
  }

  //delete currency master

  DeleteCurrency(CurrencyId: any) {
    this.spinner.show();
    this.rfqservice.RemoveMasterCurrencyById(CurrencyId, this.employee.EmployeeNo).subscribe(data => {
      this.spinner.hide()
      if (data) {
        this.CurrencyMasterList = data;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Currency Deleted' });
      }
    })
  }
}
