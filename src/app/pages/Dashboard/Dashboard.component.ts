import { Component, ViewChild, ElementRef } from '@angular/core';
import { Employee, DynamicSearchResult, searchList } from 'src/app/Models/mpr';
import { Router } from '@angular/router';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import funnel from 'highcharts/modules/funnel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @ViewChild("container", { read: ElementRef, static: true }) container: ElementRef;
  constructor(public MprService: MprService, public constants: constants, private router: Router, private datePipe: DatePipe) { }

  public totalMPRCnt: number = 0;
  public completedMPRCnt: number = 0;
  public checkerListCnt: number = 0;
  public ApproversListCnt: number = 0;
  public PAListCnt: number = 0;
  public dynamicData = new DynamicSearchResult();
  public employee: Employee;
  public mprStatusList: Array<any> = [];
  public typeofChart: string;
  public fromDate: Date;
  public toDate: Date
  public chartLables: Array<any> = [];
  public chartData: Array<any> = [];
  public BuyerGroupId: number;
  public BuyerGroupName: string = "";
  public showList; boolean = false;
  public searchItems: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public MPRList: Array<any> = [];

  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");
    this.MPRList = [];
    this.getTotalMPRCnt();
    this.getCompletedMPRCnt();
    this.getMPRtotalcnt();
    this.getPAListCnt();
    if (this.employee.OrgDepartmentId == 14) {
      this.chartLables = [['Approved', 3], ['Acknowledged', 4], ['RFQ Generated', 7], ['RFQ Responded', 8], ['Technical Spec Approved', 9], ['RFQ Finalized', 17], ['PA Generated', 11], ['PA Approved', 18], ['Raising PO Checked', 13], ['Raising PO Approved', 14], ['PO Released', 12], ['MPR On Hold', 16], ['MPR Rejected', 15], ['MPR Closed', 19]];
      this.typeofChart = "funnel";
      this.toDate = new Date();
      this.fromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      this.getMPRStatusData();
    }

  }

  getTotalMPRCnt() {
    this.dynamicData = new DynamicSearchResult();
    if (this.employee.OrgDepartmentId == 14)
      this.dynamicData.query = "Select Count(*) as count from MPRRevisionDetails_woItems mpr left join  MPR_GetAssignEmployeList mprasgn on mprasgn.MprRevisionId = mpr.RevisionId Where BoolValidRevision=1  and  CheckStatus='Approved' and ApprovalStatus='Approved' and (SecondApprover ='-') and (ThirdApprover ='-' ) OR (SecondApprover!='-' and SecondApproversStatus='Approved') or (ThirdApprover!='-' and ThirdApproverStatus='Approved')";
    else
      this.dynamicData.query = " Select Count(*) as count from MPRRevisionDetails_woItems mpr left join  MPR_GetAssignEmployeList mprasgn on mprasgn.MprRevisionId = mpr.RevisionId Where BoolValidRevision=1  and PreparedBy=" + this.employee.EmployeeNo+" and CheckedBy != '-' and ApprovedBy != '-'";
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

  getMPRtotalcnt() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from MPRRevisionDetails_woItems where BoolValidRevision = 1 and(CheckedBy = " + this.employee.EmployeeNo + " and CheckStatus not in ('Approved', 'MPR Rejected','Sent for Modification')) or (ApprovedBy =" + this.employee.EmployeeNo +" and ApprovalStatus not in ('Approved', 'MPR Rejected','Sent for Modification'))";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.MPRList = data;
      this.checkerListCnt = this.MPRList.filter(li => li.CheckedBy == this.employee.EmployeeNo).length;
      this.ApproversListCnt = this.MPRList.filter(li => li.ApprovedBy === this.employee.EmployeeNo).length;
    })
  }
  getPAListCnt() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select  count(*) as count from MPRPAApprovers mprap inner join MPRPADetails mprpa on mprap.PAId=mprpa.PAId  where  mprap.ApprovalStatus in ('pending', 'submitted')  and mprpa.DeleteFlag=0 and mprpa.PAStatus not in ('Rejected')  and mprap.Approver =" + this.employee.EmployeeNo+"";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {   
      this.PAListCnt = data[0].count;
    })
  }

  navigateTopage(page: string) {
    this.router.navigateByUrl('/SCM/'+page+'');
  }
  //Load MPRStatus Chart
  getMPRStatusData() {
    var FromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    var ToDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from MPRRevisions where BoolValidRevision=1 and PreparedOn <= '" + ToDate + "' and PreparedOn >= '" + FromDate + "' and StatusId in (3,4,7,8,9,17,11,18,13,14,12,16,15,19) ";
    if (this.BuyerGroupId)
      this.dynamicData.query += " and BuyerGroupId=" + this.BuyerGroupId + "";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.mprStatusList = data;
      if (this.mprStatusList.length > 0) {
        this.chartData = [
          ['Approved', this.mprStatusList.filter(li => li.StatusId == 3).length],
          ['Acknowledged', this.mprStatusList.filter(li => li.StatusId == 4).length],
          ['RFQ Generated', this.mprStatusList.filter(li => li.StatusId == 7).length],
          ['RFQ Responded', this.mprStatusList.filter(li => li.StatusId == 8).length],
          ['Technical Spec Approved', this.mprStatusList.filter(li => li.StatusId == 9).length],
          ['RFQ Finalized', this.mprStatusList.filter(li => li.StatusId == 17).length],
          ['PA Generated', this.mprStatusList.filter(li => li.StatusId == 11).length],
          ['PA Approved', this.mprStatusList.filter(li => li.StatusId == 18).length],
          ['Raising PO Checked', this.mprStatusList.filter(li => li.StatusId == 13).length],
          ['Raising PO Approved', this.mprStatusList.filter(li => li.StatusId == 14).length],
          ['PO Released', this.mprStatusList.filter(li => li.StatusId == 12).length],
          ['MPR On Hold', this.mprStatusList.filter(li => li.StatusId == 16).length],
          ['MPR Rejected', this.mprStatusList.filter(li => li.StatusId == 15).length],
          ['MPR Closed', this.mprStatusList.filter(li => li.StatusId == 19).length]

        ];
        this.loadChart();
      }
      else
        this.container.nativeElement.innerHTML = "";
    })
  }

  typeChange() {
    this.loadChart();
  }

  bindLabelData(event: any, index: number, label: string, id: number) {
    if (event.target.checked == false) {
      for (var i = 0; i < this.chartData.length; i++) {
        if (this.chartData[i][0] == label)
          this.chartData.splice(i, 1)
      }
    }
    else {
      var obj = [label, this.mprStatusList.filter(li => li.StatusId == id).length];
      this.chartData.splice(index, 0, obj);
      //this.chartData.push(obj,)
    }
    this.loadChart();
  }

  loadChart() {
    Highcharts.chart(this.container.nativeElement, {

      chart: {
        type: this.typeofChart
      },
      title: {
        text: 'MPR Status'
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> ({point.y:,.0f})',
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            softConnector: true
          },
          center: ['40%', '50%'],
          neckWidth: '30%',
          neckHeight: '25%',
          width: '70%'
        }
      },
      legend: {
        enabled: true
      },
      series: [{
        name: 'No.Of MPRs',
        data: this.chartData
      }]

    });
  }

  public bindSearchListData(name?: string, searchTxt?: string) {
    if (searchTxt == undefined)
      searchTxt = "";
    searchTxt = searchTxt.replace('*', '%');
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '" + searchTxt + "%'";
    this.MprService.GetListItems(this.dynamicData).subscribe(data => {
      if (data.length == 0)
        this.showList = false;
      else
        this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {
        fName = item[this.constants[name].fieldName];
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId] };
        this.searchItems.push(value);
      });
    });
  }
  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;

    this.BuyerGroupName = item.name;

    this.BuyerGroupId = item.code;
  }

  //clear model when search text is empty
  onsrchTxtChange() {
    if (this.BuyerGroupName == "") {
      this.BuyerGroupId = null;
    }
  }
  dialogCancel(dialogName) {
    this[dialogName] = false;
  }


}
