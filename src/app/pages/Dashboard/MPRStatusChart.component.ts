import { ViewChild, ElementRef } from '@angular/core';
import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import funnel from 'highcharts/modules/funnel';
import { Employee, DynamicSearchResult} from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { DatePipe } from '@angular/common';

Exporting(Highcharts);
funnel(Highcharts);

@Component({
  selector: 'ngx-MPRStatusChart',
  templateUrl: './MPRStatusChart.component.html',
})
export class MPRStatusChartComponent {

  @ViewChild("container", { read: ElementRef, static: true }) container: ElementRef;
  constructor(public MprService: MprService, private datePipe: DatePipe ) { }

  public dynamicData = new DynamicSearchResult();
  public mprStatusList: Array<any> = [];
  public typeofChart: string;
  public fromDate: Date;
  public toDate: Date

  ngOnInit() {
    this.typeofChart = "funnel";
    this.toDate = new Date();
    this.fromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    this.getMPRStatusData();
  }

  getMPRStatusData() {
    var FromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    var ToDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from MPRRevisions where BoolValidRevision=1 and PreparedOn <= '" + ToDate + "' and PreparedOn >= '" + FromDate + "'";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.mprStatusList = data;
      this.loadChart();
    })
  }
  typeChange() {
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
        data: [
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
          ['MPR Closed', this.mprStatusList.filter(li => li.StatusId == 19).length],        
        ]
      }]

    });
  }
}
