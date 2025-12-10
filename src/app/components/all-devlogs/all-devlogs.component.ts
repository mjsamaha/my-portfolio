import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DevlogService } from '../../services/devlog.service';
import { DevLogProjectSummary, ProjectStatus } from '../../models/devlog.model';
import {
  formatDate,
  getStatusBadgeClass,
  getStatusLabel,
  getRelativeTime
} from '../../utils/devlog.utils';

@Component({
  selector: 'app-all-devlogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-devlogs.component.html',
  styleUrl: './all-devlogs.component.css'
})
export class AllDevlogsComponent implements OnInit, OnDestroy {
  projects: DevLogProjectSummary[] = [];
  filteredProjects: DevLogProjectSummary[] = [];
  isLoading = true;
  error: string | null = null;

  // Filter options
  selectedStatus: ProjectStatus | 'all' = 'all';
  searchQuery = '';
  sortBy: 'recent' | 'title' | 'posts' = 'recent';

  private destroy$ = new Subject<void>();

  // Expose utility functions to template
  formatDate = formatDate;
  getStatusBadgeClass = getStatusBadgeClass;
  getStatusLabel = getStatusLabel;
  getRelativeTime = getRelativeTime;

  statusOptions: { value: ProjectStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Projects' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' }
  ];

  constructor(
    private devlogService: DevlogService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.error = null;

    this.devlogService.getAllProjectSummaries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load DevLogs. Please try again.';
          this.isLoading = false;
          console.error('Error loading projects:', err);
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.projects];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'recent':
        filtered.sort((a, b) =>
          new Date(b.latestPostDate).getTime() - new Date(a.latestPostDate).getTime()
        );
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'posts':
        filtered.sort((a, b) => b.postCount - a.postCount);
        break;
    }

    this.filteredProjects = filtered;
  }

  setStatusFilter(status: ProjectStatus | 'all'): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  setSortBy(sortBy: 'recent' | 'title' | 'posts'): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  navigateToDevlog(projectId: string): void {
    this.router.navigate(['/projects', projectId, 'devlog']);
  }

  clearFilters(): void {
    this.selectedStatus = 'all';
    this.searchQuery = '';
    this.sortBy = 'recent';
    this.applyFilters();
  }
}
