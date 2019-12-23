import { Component,OnInit } from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import {NbMenuService} from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'SCMUI';

  constructor(private analytics:AnalyticsService,private menuService:NbMenuService,private router:Router){

  }
  ngOnInit() {
  this.analytics.trackPageViews();
  this.menuService.onItemClick()
  .subscribe((event)=>{
    this.onContecxtItemSelection(event.item.title)
  });
  }

  onContecxtItemSelection(title){
if(title =="Logout"){
  this.router.navigate(['/pages/Login']);
}
  }
}
