import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {

   var data= this.authService.getAuthData()
   console.log(data.timer);
    // var timer=localStorage.geItem("expiration");
    if(data.timer==3600)
    {
      // console.log(timer);
      location.reload();
    }
  }

}
