import { Component, OnInit } from '@angular/core';
import { ProjectDataService } from '../Service/project-data.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private projectData: ProjectDataService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllProjects();
    this.getAllProjectNames();
  }

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

  selectProject(project: any) {
    if (project.checked) {
      this.projectData
        .getProjectDetailById(project.projectId)
        .subscribe((data) => {
          const selectedProject = data as any;
          const index = this.filteredProjects.findIndex(
            (p) => p.projectId === selectedProject.projectId
          );

          if (index === -1) {
            this.filteredProjects.push(selectedProject);
            this.checkedProjectIds.push(selectedProject.projectId);
          } else {
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
    this.toastr.success('File Downloaded Successfully');
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
