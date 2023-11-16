import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  baseUrl = 'https://localhost:7194/api/TableProjects/';
  constructor(private userhttp: HttpClient) {}
  getAllProjects(): Observable<any[]> {
    return this.userhttp.get<any[]>(this.baseUrl + 'GetAllProjects');
  }
    getProjectsByMonth(month: number) {
      return this.userhttp.get(this.baseUrl + `projectsByMonth/${month}`);
    }
    getProjectNames(){
      return this.userhttp.get(this.baseUrl+'GetAllProjectNames');
    }
    getProjectDetailById(Id:number)
    {
      return this.userhttp.get(`${this.baseUrl}GetProjectsById?Id=${Id}`);
    }
  }

