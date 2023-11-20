import { Component, OnInit } from '@angular/core';
import { ProjectDataService } from '../Service/project-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
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
  checkedProjectIds: number[] = [];
  selectAll: boolean = false;

  constructor(private projectData: ProjectDataService) {}

  ngOnInit() {
    this.getAllProjects();
    // this.getProjectByMonth();
    this.getAllProjectNames();
  }

  // getAllProjects() {
  //   this.projectData.getAllProjects().subscribe((data) => {
  //     this.Projects = data as any[];
  //   });
  // }

  getAllProjects() {
    this.projectData.getAllProjects().subscribe((data) => {
      this.Projects = data as any[];
      this.updateFilteredProjects();
    });
  }

  getProjectById(id: number) {
    debugger;
    this.projectData.getProjectDetailById(id).subscribe((data) => {
      const project = data as any;

      const index = this.filteredProjects.findIndex(
        (p) => p.projectId === project.projectId
      );

      if (index === -1) {
        this.filteredProjects.push(project);
      } else {
        this.filteredProjects[index] = project;
      }
    });
  }

  getAllProjectNames() {
    this.projectData.getProjectNames().subscribe((data) => {
      this.projectNames = data as any[];
    });
  }

  getProjectByMonth() {
    this.projectData
      .getProjectsByMonth(this.selectedMonth.value)
      .subscribe((data) => {
        this.filteredProjects = data as any[];
      });
  }

  // selectProject(project: any) {
  //   this.getProjectById(project.projectId);
  // }

  // selectProject(project: any) {
  //   if (project.checked) {
  //     this.checkedProjectIds.push(project.projectId);
  //   } else {
  //     const index = this.checkedProjectIds.indexOf(project.projectId);
  //     if (index !== -1) {
  //       this.checkedProjectIds.splice(index, 1);
  //     }
  //   }
  //   this.updateFilteredProjects();
  // }

  selectProject(project: any) {
    if (project.checked) {
      this.projectData
        .getProjectDetailById(project.projectId)
        .subscribe((data) => {
          const selectedProject = data as any;

          // Check if the project is already in filteredProjects
          const index = this.filteredProjects.findIndex(
            (p) => p.projectId === selectedProject.projectId
          );

          // If the project is not in filteredProjects, add it
          if (index === -1) {
            this.filteredProjects.push(selectedProject);
            this.checkedProjectIds.push(selectedProject.projectId);
          } else {
            // If the project is already in filteredProjects, update its details
            this.filteredProjects[index] = selectedProject;
          }
        });
    } else {
      this.removeUncheckedProject(project.projectId);
    }
  }

 
  
  
  removeUncheckedProject(projectId: number) {
    const index = this.filteredProjects.findIndex(
      (p) => p.projectId === projectId
    );

    if (index !== -1) {
      this.filteredProjects.splice(index, 1);
      this.checkedProjectIds = this.checkedProjectIds.filter(
        (id) => id !== projectId
      );
    }
  }
  // selectAllProjects() {
  //   this.Projects.forEach((project) => {
  //     project.checked = this.selectAll;
  //   });

  //   this.filterProjectsByProject();
  // }

  selectAllProjects() {
    this.Projects.forEach((project) => {
      project.checked = !project.checked;
    });
    this.checkedProjectIds = this.Projects.filter(
      (project) => project.checked
    ).map((project) => project.projectId);
    this.updateFilteredProjects();
  }

  updateFilteredProjects() {
    this.filteredProjects = this.Projects.filter((project) =>
      this.checkedProjectIds.includes(project.projectId)
    );
  }

  selectMonth(month: { name: string; value: number }) {
    this.selectedMonth = month;
    this.getProjectByMonth();
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
    const headers = [
      'Project Id',
      'Project Name',
      'Client',
      'Start Date',
      'End Date',
      'Country',
      'Budget',
      'Status',
    ];
    const csvArray = [headers.join(',')];

    this.filteredProjects.forEach((project) => {
      const row = [
        project.projectId,
        project.projectName,
        project.client,
        this.formatDate(project.startDate),
        this.formatDate(project.endDate),
        project.country,
        project.budget,
        project.status,
      ];
      csvArray.push(row.join(','));
    });

    return csvArray.join('\n');
  }

  filterProjectsByProject() {
    this.filteredProjects = this.Projects.filter((project) => project.checked);
  }

  formatDate(date: any) {
    return date;
  }
}
