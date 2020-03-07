import { Component } from '@angular/core';
import { Employee, DynamicSearchResult } from 'src/app/Models/mpr';
import { ActivatedRoute, Router } from '@angular/router';
import { MprService } from 'src/app/services/mpr.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(public MprService: MprService, private router: Router) { }
  public totalMPRCnt: number=0;
  public completedMPRCnt: number=0;
  public dynamicData = new DynamicSearchResult();
  public employee: Employee;
  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");
    this.getTotalMPRCnt();
    this.getCompletedMPRCnt();

  }

  getTotalMPRCnt() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select count(*) as count from MPRDetails";
    if (this.employee.OrgDepartmentId != 14)
      this.dynamicData.query += " where SubmittedBy='" + this.employee.EmployeeNo + "'";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.totalMPRCnt = data[0].count;
    })
  }
  getCompletedMPRCnt() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select count(*) as count from MPRStatusTrackDetails ms inner join MPRRevisions mpr on mpr.RevisionId=ms.RevisionId  where mpr.BoolValidRevision=1 and ms.StatusId in (12,16,19)";
    if (this.employee.OrgDepartmentId != 14)
      this.dynamicData.query += " and mpr.PreparedBy='" + this.employee.EmployeeNo + "'";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.completedMPRCnt = data[0].count;
    })
  }
}
