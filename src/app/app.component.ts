import { Component, OnInit, HostListener } from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import { NbMenuService } from '@nebular/theme';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Router } from '@angular/router';
import { MprService } from './services/mpr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'SCMUI';

  constructor(private idle: Idle, private keepalive: Keepalive,private analytics:AnalyticsService,private menuService:NbMenuService,private router:Router,private _usermanage:MprService){

    idle.setIdle(18000);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(18000);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    idle.onTimeoutWarning.subscribe((countdown: number) => {
      //alert('Timeout Warning - ' + countdown);
    });

    idle.onTimeout.subscribe(() => {
      localStorage.clear();
      this._usermanage.logout();
      this.router.navigate(['/SCM/Login']);
    });
    idle.watch();
  }

  //@HostListener('window:beforeunload ', ['$event'])
  //unloadHandler(event) {
  //  localStorage.clear();
  //}

  ngOnInit() {
  this.analytics.trackPageViews();
  this.menuService.onItemClick()
  .subscribe((event)=>{
    this.onContecxtItemSelection(event.item.title)
  });
  }

  onContecxtItemSelection(title){
if(title =="Logout"){
  this._usermanage.logout();
  this.router.navigate(['/SCM/Login']);
}
  }
}
