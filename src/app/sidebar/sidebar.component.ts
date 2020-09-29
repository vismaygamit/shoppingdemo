import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  userIsAuthenticated=false;
    private authListenerSubs : Subscription;
  currentpath: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.currentpath=location.pathname;
    console.log(this.currentpath);
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authListenerSubs=this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated=>{
      this.userIsAuthenticated=isAuthenticated;
    });
  }

  ngOnDestroy()
  {
    this.authListenerSubs.unsubscribe();
  }

}
