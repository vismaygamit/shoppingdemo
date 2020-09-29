import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ReportsComponent } from './reports/reports.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { DemoComponent } from './demo/demo.component';


const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuard]},
  {path:'manage_product',component:ManageProductComponent,canActivate:[AuthGuard]},
  {path:'manage_cateory',component:ManageCategoryComponent,canActivate:[AuthGuard]},
  {path:'manage_users',component:ManageUsersComponent,canActivate:[AuthGuard]},
  {path:'reports',component:ReportsComponent,canActivate:[AuthGuard]},
  // {path:'/',component:DemoComponent},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},
  // {path:'demo',component:DemoComponent,canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
