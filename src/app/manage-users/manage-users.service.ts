import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_URL=environment.apiUrl + "/user/";

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {

private users:User[]=[];
private usersUpdated = new Subject<{users:User[], userCount:number}>();
  constructor(private http:HttpClient, private router:Router) { }

  getUsers(usersPerPage:number, currentPage:number)
  {

    console.log("inside service"+usersPerPage+"sec"+currentPage);
    const queryParams=`?pagesize=${usersPerPage}&page=${currentPage}`;
this.http
.get<{ message:string; users:any; maxUsers:number }>(
  BACKEND_URL + queryParams
)
.pipe(
  map(userData=>{
  return {
    users:userData.users.map(user=>{
      return{
        id:user.id,
        name:user.name,
        email:user.email,
        password:user.password,
        contact:user.contact,
        address:user.address,
        image:user.image,
        unique_id:user.unique_id
       };
    }), maxUsers:userData.maxUsers};
  }))
  .subscribe(transformedUserData=>{
    console.log(transformedUserData);
    this.users=transformedUserData.users;
    this.usersUpdated.next({
      users:[...this.users],
      userCount:transformedUserData.maxUsers
    });
  });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

}
