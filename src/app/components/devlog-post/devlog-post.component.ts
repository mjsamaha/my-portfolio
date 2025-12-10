import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { DevlogService } from '../../services/devlog.service';
import { DevLogProject, DevLogPost } from '../../models/devlog.model';
import {
  formatDate,
  calculateReadingTime,
  getRelativeTime
} from '../../utils/devlog.utils';

@Component({
  selector: 'app-devlog-post',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  templateUrl: './devlog-post.component.html',
  styleUrl: './devlog-post.component.css'
})
export class DevlogPostComponent implements OnInit, OnDestroy {
  project: DevLogProject | null = null;
  post: DevLogPost | null = null;
  prevPost: DevLogPost | null = null;
  nextPost: DevLogPost | null = null;
  isLoading = true;
  error: string | null = null;
  readingTime = 0;

  private destroy$ = new Subject<void>();

  // Expose utility functions to template
  formatDate = formatDate;
  getRelativeTime = getRelativeTime;

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
        const postId = params['postId'];

        if (projectId && postId) {
          this.loadPost(projectId, postId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPost(projectId: string, postId: string): void {
    this.isLoading = true;
    this.error = null;

    // Load project
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
        },
        error: (err) => {
          this.error = 'Failed to load project';
          this.isLoading = false;
          console.error('Error loading project:', err);
        }
      });

    // Load post
    this.devlogService.getDevLogPost(projectId, postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post) => {
          if (!post) {
            this.error = 'Post not found';
            this.isLoading = false;
            return;
          }

          this.post = post;
          this.readingTime = post.readingTime || calculateReadingTime(post.content);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load post';
          this.isLoading = false;
          console.error('Error loading post:', err);
        }
      });

    // Load adjacent posts for navigation
    this.devlogService.getAdjacentPosts(projectId, postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (adjacent) => {
          this.prevPost = adjacent.prev;
          this.nextPost = adjacent.next;
        },
        error: (err) => {
          console.error('Error loading adjacent posts:', err);
        }
      });
  }

  navigateToDevlog(): void {
    if (this.project) {
      this.router.navigate(['/projects', this.project.id, 'devlog']);
    }
  }

  navigateToPost(postId: string): void {
    if (this.project) {
      this.router.navigate(['/projects', this.project.id, 'devlog', postId]);
    }
  }

  getTagClass(tag: string): string {
    const tagClasses: Record<string, string> = {
      'feature': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bug-fix': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'milestone': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'design': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'refactor': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'testing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'deployment': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'documentation': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };

    return tagClasses[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }

  getPostStatusClass(status: string): string {
    return status === 'draft'
      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  }
}
