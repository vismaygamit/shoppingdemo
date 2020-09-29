import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth.model';
import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";

const BACKEND_URL=environment.apiUrl + "/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated=false;
  private token:string;
  private tokenTimer:any;
  private authStatusListener=new Subject<boolean>();
  private userId:string;
  timer: number;
  constructor(private http:HttpClient, private router:Router) { }

  getToken()
  {
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId()
  {
    return this.userId;
  }

  getAuthStatusListener()
  {
    return this.authStatusListener.asObservable();
  }
  createUser(email:string, password:string)
  {
    const authData:AuthData={email:email,password:password};
    // return
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(response=>{
      this.router.navigate(['/']);
    },error=>{
      this.authStatusListener.next(false);

    });
    // subscribe(response=>{
    //   console.log(response);
    // }, error=> {

    // });

  }

  login(email:string, password:string)
  {
    const authData:AuthData={email:email,password:password};
    this.http.post<{token:string,message:string, userId:string, expiresIn:number}>(BACKEND_URL + "/login", authData).
    subscribe(response=>{
      console.log(response);

      const token=response.token;
      this.token=token;
      if(token)
      {
         Swal.fire(
        'Success!',
        "Welcome to Shopping",
        'success'
      );

        const expiresInDuration=response.expiresIn;
        console.log(expiresInDuration);
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated=true;
        this.userId=response.userId;
      this.authStatusListener.next(true);
      const now=new Date();
      const expirationDate=new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(token,expirationDate,this.userId);
      this.router.navigate(['dashboard']);
      }
      else
      {
        console.log("inside else");
        Swal.fire(
          'Error!',
          "Please enter valid or password",
          'error'
        );
      }


    },error=>{
      // console.log("error"+ error.error.message);
      this.authStatusListener.next(false);

      // console.log(error);
    //   Swal.fire({
    //     title: 'Oops!',
    //     text: error.error.message,
    //     icon: 'error',

    //   });
    });
  }

  autoAuthUser()
  {
    const authInformation=this.getAuthData();
    if(!authInformation)
    {
      // return;
    this.router.navigate(['login']);

    }
    const now=new Date();
    const expiresIn=authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0)
    {
      this.token=authInformation.token;
      this.isAuthenticated=true;
      this.userId=authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout()
  {
    this.token=null;
    this.isAuthenticated=false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId=null;
    this.router.navigate(['login']);
    console.log(this.token);

  }

  private setAuthTimer(duration:number)
  {
    console.log("setting timer"+duration);
    this.timer=duration;
    this.tokenTimer=setTimeout(()=>{
      this.logout();
    }, duration*1000);
  }

  private saveAuthData(token: string,expirationDate:Date, userId:string)
  {
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  public getAuthData()
  {
    const token=localStorage.getItem('token');
    const expirationDate=localStorage.getItem('expiration');
    const userId=localStorage.getItem('userId');
    if(!token && expirationDate)
    {
      return;
    }
      return{
        token:token,
        expirationDate: new Date(expirationDate),
        userId:userId,
        timer:this.timer
      };

  }

}
