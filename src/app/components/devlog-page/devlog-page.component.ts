import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DevlogService } from '../../services/devlog.service';
import { DevLogProject, DevLogPost } from '../../models/devlog.model';
import {
  formatDate,
  sortPostsByDate,
  getStatusBadgeClass,
  getStatusLabel,
  calculateProjectProgress,
  getUniqueTags
} from '../../utils/devlog.utils';

@Component({
  selector: 'app-devlog-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devlog-page.component.html',
  styleUrl: './devlog-page.component.css'
})
export class DevlogPageComponent implements OnInit, OnDestroy {
  project: DevLogProject | null = null;
  posts: DevLogPost[] = [];
  filteredPosts: DevLogPost[] = [];
  availableTags: string[] = [];
  selectedTag: string | null = null;
  isLoading = true;
  error: string | null = null;
  projectProgress = 0;

  private destroy$ = new Subject<void>();

  // Expose utility functions to template
  formatDate = formatDate;
  getStatusBadgeClass = getStatusBadgeClass;
  getStatusLabel = getStatusLabel;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private devlogService: DevlogService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const projectId = params['projectId'];
        if (projectId) {
          this.loadProject(projectId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProject(projectId: string): void {
    this.isLoading = true;
    this.error = null;

    this.devlogService.getProjectDevLog(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (project) => {
          if (!project) {
            this.error = 'Project not found';
            this.isLoading = false;
            return;
          }

          this.project = project;
          this.posts = sortPostsByDate(project.devlogPosts);
          this.filteredPosts = [...this.posts];
          this.availableTags = getUniqueTags(this.posts);

          // Calculate project progress
          this.projectProgress = calculateProjectProgress(
            project.startDate,
            project.expectedEndDate,
            project.completionDate
          );

          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load DevLog. Please try again.';
          this.isLoading = false;
          console.error('Error loading project:', err);
        }
      });
  }

  filterByTag(tag: string | null): void {
    this.selectedTag = tag;

    if (!tag) {
      this.filteredPosts = [...this.posts];
    } else {
      this.filteredPosts = this.posts.filter(post =>
        post.tags.includes(tag as any)
      );
    }
  }

  navigateToPost(postId: string): void {
    if (this.project) {
      this.router.navigate(['/projects', this.project.id, 'devlog', postId]);
    }
  }

  getPostStatusClass(status: string): string {
    return status === 'draft'
      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  }

  getTagClass(tag: string): string {
    const tagClasses: Record<string, string> = {
      'feature': 'bg-blue-100 text-blue-800',
      'bug-fix': 'bg-red-100 text-red-800',
      'milestone': 'bg-purple-100 text-purple-800',
      'design': 'bg-pink-100 text-pink-800',
      'refactor': 'bg-yellow-100 text-yellow-800',
      'testing': 'bg-green-100 text-green-800',
      'deployment': 'bg-indigo-100 text-indigo-800',
      'documentation': 'bg-gray-100 text-gray-800'
    };

    return tagClasses[tag] || 'bg-gray-100 text-gray-800';
  }
}
