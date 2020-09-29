import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated=false;
    private authListenerSubs : Subscription;
  currentpath: string;
    constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authService.autoAuthUser();

    this.currentpath=location.pathname;
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authListenerSubs=this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated=>{
      this.userIsAuthenticated=isAuthenticated;
    });
  }

  onLogout()
  {

    this.authService.logout();
  }
  ngOnDestroy()
  {
    this.authListenerSubs.unsubscribe();
  }

}
