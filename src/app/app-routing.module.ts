import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';


const routes: Routes = [{ path: '', redirectTo: '/login', pathMatch: 'full' },{path:'dashboard',component:DashboardComponent},{path:'login',component:LoginComponent},{path:'signup',component:SignUpComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
