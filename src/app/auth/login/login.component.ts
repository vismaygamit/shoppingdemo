import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {

    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        // this.isLoading=false;
      });
  }

  onLogin(form: NgForm)
  {
    if(form.invalid)
    {
      return;
    }
    // this.isLoading=true;
    this.authService.login(form.value.email,form.value.password);
    // console.log(this.authService.login(form.value.email,form.value.password));
    // const un=form.value.email;
    // const pass=form.value.password;
    // console.log("un"+un+ "password"+pass);
  }
}
