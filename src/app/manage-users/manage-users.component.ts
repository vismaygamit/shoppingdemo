import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {PageEvent } from '@angular/material/paginator';
import { ManageUsersService } from './manage-users.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from './user.model';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})


export class ManageUsersComponent implements OnInit {
users: User[] = [];
 isLoading=false;
 totalUsers=0;
 usersPerPage=10;
 pageSizeOptions=[10,15,20];
 currentPage=1;
//  postsPerPage=10;
 private usersSub: Subscription;

  constructor(public userService:ManageUsersService, private router:Router) { }


  // parentEvent()
  // {


  // }


  ngOnInit(): void {
    this.isLoading=true;
    this.userService.getUsers(this.usersPerPage,this.currentPage);
    this.usersSub=this.userService
    .getUserUpdateListener()
    .subscribe((userData:{users:User[];userCount:number})=>{
      this.isLoading=false;
      this.totalUsers=userData.userCount;
      this.users=userData.users;
      console.log(userData);

    });

    console.log(this.users);
}


onChangedPage(pageData: PageEvent)
  {

    // console.log(pageData);
    this.isLoading=true;
    this.usersPerPage= pageData.pageSize;
    this.currentPage= pageData.pageIndex+1;
    this.userService.getUsers(this.usersPerPage,this.currentPage);
    this.isLoading=false;
// console.log(this.postsPerPage);
    // this.
  }


}
