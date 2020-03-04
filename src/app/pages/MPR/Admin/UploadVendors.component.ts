import { Component, OnInit } from '@angular/core'
import {  Employee } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-uploadVendor',
  templateUrl: './UploadVendors.component.html'

})

export class UploadVendorComponent implements OnInit {

  constructor(public MprService: MprService, private router: Router, private messageService: MessageService, private spinner: NgxSpinnerService) { }
 
  public employee: Employee;

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));

    else
      this.router.navigateByUrl("Login");
 
  }
  uploadVendorData(event: any) {
    this.spinner.show();
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      var id = this.employee.EmployeeNo;
      formData.append(id, file, file.name);
      this.MprService.uploadVendorData(formData).subscribe(data => {
        if (data) {
          this.spinner.hide();
          this.messageService.add({ severity: 'sucess', summary: 'Sucess Message', detail: 'file uploaded' });
        }
              
      });
    }
  }
  
}
