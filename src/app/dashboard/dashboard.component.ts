import { Component, OnInit } from '@angular/core';
import { ProjectDataService } from '../Service/project-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit
// {
//   Projects: any[] = [];
//   months: { name: string; value: number }[] = [
//     { name: 'January', value: 1 },
//     { name: 'February', value: 2 },
//     { name: 'March', value: 3 },
//     { name: 'April', value: 4 },
//     { name: 'May', value: 5 },
//     { name: 'June', value: 6 },
//     { name: 'July', value: 7 },
//     { name: 'August', value: 8 },
//     { name: 'September', value: 9 },
//     { name: 'October', value: 10 },
//     { name: 'November', value: 11 },
//     { name: 'December', value: 12 },
//   ];
//   selectedMonth: { name: string; value: number } = this.months[0];
//   selectedProject: string = '';
//   filteredProjects: any[] = [];
//   selectAll: boolean = false;

//   constructor(private ProjectData: ProjectDataService) {}

//   ngOnInit() {
//     this.getAllProjects();
//     this.getProjectByMonth();
//     this.getAllProjectNames();
//     this.getProjectById(2);
//   }

//   getAllProjects() {
//     this.ProjectData.getAllProjects().subscribe((data) => {
//       this.Projects = data as any[];
//     });
//   }

//   getProjectById(id:number)
//   {
//     this.ProjectData.getProjectDetailById(id).subscribe((data)=>{
//       console.warn(data);
//     })
//   }
//   getAllProjectNames()
//   {
//     this.ProjectData.getProjectNames().subscribe((data)=>{
//       console.warn(data);
//     })
//   }
//   getProjectByMonth() {
//     this.ProjectData.getProjectsByMonth(this.selectedMonth.value).subscribe((data) => {
//       this.filteredProjects = data as any[];
//     });
//   }

//   filterProjectsByProject() {
//     this.filteredProjects = this.Projects.filter((project) => project.checked);
//   }

//   selectProject(project: any) {
//     this.filterProjectsByProject();
//   }

//   selectAllProjects() {
//     this.Projects.forEach((project) => {
//       project.checked = this.selectAll;
//     });

//     this.filterProjectsByProject();
//   }

//   selectMonth(month: { name: string; value: number }) {
//     this.selectedMonth = month;
//     this.getProjectByMonth(); // Call the API when the month is selected
//   }

//   exportToCSV() {
//     const csvData = this.generateCSVData();
//     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.setAttribute('download', 'projects.csv');

//     document.body.appendChild(link);
//     link.click();

//     document.body.removeChild(link);
//   }

//   generateCSVData() {
//     const headers = ['Project Id', 'Project Name', 'Client', 'Start Date', 'End Date','Country','Budget','Status'];
//     const csvArray = [headers.join(',')];

//     this.filteredProjects.forEach((project) => {
//       const row = [
//         project.projectId,
//         project.projectName,
//         project.client,
//         this.formatDate(project.startDate),
//         this.formatDate(project.endDate),
//         project.country,
//         project.budget,
//         project.status,
//       ];
//       csvArray.push(row.join(','));
//     });

//     return csvArray.join('\n');
//   }

//   formatDate(date: any) {
//     // Add your date formatting logic here
//     return date;
//   }
// }
{
  
  Projects: any[] = [];
  projectNames: any[] = [];
  months: { name: string; value: number }[] = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];
  selectedMonth: { name: string; value: number } = this.months[0];
  selectedProject: string = '';
  filteredProjects: any[] = [];
  selectAll: boolean = false;

  constructor(private projectData: ProjectDataService) {}

  ngOnInit() {
    this.getAllProjects();
    this.getProjectByMonth();
    this.getAllProjectNames();
    // this.getProjectById(2);
  }

  getAllProjects() {
    this.projectData.getAllProjects().subscribe((data) => {
      this.Projects = data as any[];
    });
  }

  getProjectById(id: number) {
    this.projectData.getProjectDetailById(id).subscribe((data) => {
      const project = data as any;
  
      // Check if the project is already in filteredProjects
      const index = this.filteredProjects.findIndex(p => p.projectId === project.projectId);
  
      // If the project is checked, add it to filteredProjects
      if (project.checked && index === -1) {
        this.filteredProjects.push(project);
      } else if (!project.checked && index !== -1) {
        // If the project is unchecked, remove it from filteredProjects
        this.filteredProjects.splice(index, 1);
      }
    });
  }
  

  getAllProjectNames() {
    this.projectData.getProjectNames().subscribe((data) => {
      this.projectNames = data as any[];
    });
  }

  getProjectByMonth() {
    this.projectData.getProjectsByMonth(this.selectedMonth.value).subscribe((data) => {
      this.filteredProjects = data as any[];
    });
  }

  selectProject(project: any) {
    // Call getProjectById when a project is selected
    this.getProjectById(project.projectId);
  }

  selectAllProjects() {
    this.Projects.forEach((project) => {
      project.checked = this.selectAll;
    });

    this.filterProjectsByProject();
  }

  selectMonth(month: { name: string; value: number }) {
    this.selectedMonth = month;
    this.getProjectByMonth(); // Call the API when the month is selected
  }

  exportToCSV() {
    const csvData = this.generateCSVData();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'projects.csv');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  generateCSVData() {
    const headers = ['Project Id', 'Project Name', 'Client', 'Start Date', 'End Date', 'Country', 'Budget', 'Status'];
    const csvArray = [headers.join(',')];

    this.filteredProjects.forEach((project) => {
      const row = [
        project.ProjectId,
        project.ProjectName,
        project.Client,
        this.formatDate(project.StartDate),
        this.formatDate(project.EndDate),
        project.Country,
        project.Budget,
        project.Status,
      ];
      csvArray.push(row.join(','));
    });

    return csvArray.join('\n');
  }
  filterProjectsByProject() {
    this.filteredProjects = this.Projects.filter((project) => project.checked);
  }

  formatDate(date: any) {
    // Add your date formatting logic here
    return date;
  }
}