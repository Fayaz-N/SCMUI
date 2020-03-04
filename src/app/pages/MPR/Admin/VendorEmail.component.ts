import { Component, OnInit } from '@angular/core'
import { sendMailObj, Employee } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-vendorEmail',
  templateUrl: './VendorEmail.component.html'

})

export class VendorEmailComponent implements OnInit {

  constructor(public MprService: MprService, private router: Router, private messageService: MessageService, private spinner: NgxSpinnerService) { }
 
  public employee: Employee;
  public sendMailObj: sendMailObj;
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));

    else
      this.router.navigateByUrl("Login");
    this.sendMailObj = new sendMailObj();

  }
  onEmailSend() {
    if (this.sendMailObj.Message) {
      this.spinner.show();
      this.sendMailObj.Message = this.sendMailObj.Message.replace(/\n/g, '<br />');
      this.MprService.sendMailtoVendor(this.sendMailObj).subscribe(data => {
        if (data) {
          this.sendMailObj.Message = this.sendMailObj.Message.replace('<br />', '/\n/g');
          this.spinner.hide();
          this.messageService.add({ severity: 'sucess', summary: 'Sucess Message', detail: 'Mail Sent' });
        }
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Add Message' });
    }
  }

  
}
