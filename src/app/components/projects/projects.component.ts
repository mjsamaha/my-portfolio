import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Project } from '../../services/api.service';
import { DevlogService } from '../../services/devlog.service';
import { Observable, BehaviorSubject, map, startWith, combineLatest } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects$: Observable<Project[]> | undefined;
  filteredProjects$: Observable<Project[]> | undefined;
  projectDevLogStatus = new Map<string, boolean>();

  private filterSubject = new BehaviorSubject<string>('All');
  filter$ = this.filterSubject.asObservable();

  // Available filter options
  filterOptions = [
    { label: 'All Projects', value: 'All', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    { label: 'Planning', value: 'Planning', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { label: 'In-Development', value: 'In-Development', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { label: 'Completed', value: 'Completed', color: 'bg-green-100 text-green-800 hover:bg-green-200' }
  ];

  constructor(
    private apiService: ApiService,
    private devlogService: DevlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.projects$ = this.apiService.getProjects();

    // Combine projects with filter to create filtered observable
    this.filteredProjects$ = combineLatest([
      this.projects$.pipe(startWith([])),
      this.filter$.pipe(startWith('All'))
    ]).pipe(
      map(([projects, filter]) => {
        // Check DevLog status for each project
        projects.forEach(project => {
          this.checkDevLogStatus(project.id.toString());
        });

        if (filter === 'All') {
          return projects;
        }
        return projects.filter(project => project.status === filter);
      })
    );
  }

  private checkDevLogStatus(projectId: string): void {
    this.devlogService.hasDevLog(projectId).subscribe(hasDevLog => {
      this.projectDevLogStatus.set(projectId, hasDevLog);
    });
  }

  hasDevLog(projectId: number): boolean {
    return this.projectDevLogStatus.get(projectId.toString()) || false;
  }

  navigateToDevLog(projectId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/projects', projectId.toString(), 'devlog']);
  }

  setFilter(filter: string): void {
    this.filterSubject.next(filter);
  }

  getCurrentFilter(): string {
    return this.filterSubject.value;
  }

  trackByFn(index: number, item: Project): number {
    return item.id;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Planning':
        return 'bg-blue-500';
      case 'In-Development':
        return 'bg-yellow-500';
      case 'Completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Planning':
        return 'Planning Phase';
      case 'In-Development':
        return 'In Development';
      case 'Completed':
        return 'Completed';
      default:
        return status;
    }
  }

  getTechColorClass(tech: string): string {
    const colorMap = {
      'Angular': 'bg-blue-100 text-blue-800',
      'React': 'bg-blue-100 text-blue-800',
      'Vue.js': 'bg-green-100 text-green-800',
      'Node.js': 'bg-green-100 text-green-800',
      'Express': 'bg-green-100 text-green-800',
      'MongoDB': 'bg-purple-100 text-purple-800',
      'PostgreSQL': 'bg-purple-100 text-purple-800',
      'MySQL': 'bg-orange-100 text-orange-800',
      'Firebase': 'bg-yellow-100 text-yellow-800',
      'Stripe': 'bg-orange-100 text-orange-800',
      'Material-UI': 'bg-indigo-100 text-indigo-800',
      'Socket.io': 'bg-red-100 text-red-800',
      'Chart.js': 'bg-cyan-100 text-cyan-800',
      'OpenWeather API': 'bg-pink-100 text-pink-800',
      'Tailwind': 'bg-blue-100 text-blue-800',
      'React Native': 'bg-orange-100 text-orange-800',
      'Supabase': 'bg-pink-100 text-pink-800',
      'Expo': 'bg-green-100 text-green-800',
      'OpenAI API': 'bg-blue-100 text-blue-800'
    };
    return colorMap[tech as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  }
}
