import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import {
  DevLogData,
  DevLogProject,
  DevLogPost,
  DevLogProjectSummary,
  DevLogPostWithContext
} from '../models/devlog.model';

/**
 * Service for managing DevLog data
 * Handles fetching, caching, and querying project development logs
 */
@Injectable({
  providedIn: 'root'
})
export class DevlogService {
  private devlogsCache$: Observable<DevLogData> | null = null;

  constructor(private http: HttpClient) { }

  /**
   * Get all DevLog data
   * Uses caching with shareReplay to minimize HTTP requests
   */
  getAllDevLogs(): Observable<DevLogData> {
    if (!this.devlogsCache$) {
      this.devlogsCache$ = this.loadDevLogs().pipe(
        shareReplay(1)
      );
    }
    return this.devlogsCache$;
  }

  /**
   * Get a specific project's DevLog by ID
   */
  getProjectDevLog(projectId: string): Observable<DevLogProject | null> {
    return this.getAllDevLogs().pipe(
      map(data => {
        const project = data.projects.find(p => p.id === projectId);
        return project || null;
      })
    );
  }

  /**
   * Get a specific DevLog post by project ID and post ID
   */
  getDevLogPost(projectId: string, postId: string): Observable<DevLogPost | null> {
    return this.getProjectDevLog(projectId).pipe(
      map(project => {
        if (!project) {
          return null;
        }
        const post = project.devlogPosts.find(p => p.id === postId);
        return post || null;
      })
    );
  }

  /**
   * Check if a project has a DevLog
   */
  hasDevLog(projectId: string): Observable<boolean> {
    return this.getProjectDevLog(projectId).pipe(
      map(project => {
        if (!project) {
          return false;
        }
        return project.devlogPosts.length > 0;
      })
    );
  }

  /**
   * Get all projects with DevLogs as summaries
   */
  getAllProjectSummaries(): Observable<DevLogProjectSummary[]> {
    return this.getAllDevLogs().pipe(
      map(data => {
        return data.projects.map(project => this.createProjectSummary(project));
      })
    );
  }

  /**
   * Get all published posts for a project (excludes drafts)
   */
  getPublishedPosts(projectId: string): Observable<DevLogPost[]> {
    return this.getProjectDevLog(projectId).pipe(
      map(project => {
        if (!project) {
          return [];
        }
        return project.devlogPosts.filter(post => post.status === 'published');
      })
    );
  }

  /**
   * Get all posts (including drafts) for a project
   */
  getAllPosts(projectId: string): Observable<DevLogPost[]> {
    return this.getProjectDevLog(projectId).pipe(
      map(project => {
        if (!project) {
          return [];
        }
        return project.devlogPosts;
      })
    );
  }

  /**
   * Get posts filtered by tag
   */
  getPostsByTag(projectId: string, tag: string): Observable<DevLogPost[]> {
    return this.getAllPosts(projectId).pipe(
      map(posts => {
        return posts.filter(post => post.tags.includes(tag as any));
      })
    );
  }

  /**
   * Get all posts across all projects filtered by tag
   */
  getAllPostsByTag(tag: string): Observable<DevLogPostWithContext[]> {
    return this.getAllDevLogs().pipe(
      map(data => {
        const postsWithContext: DevLogPostWithContext[] = [];

        data.projects.forEach(project => {
          project.devlogPosts
            .filter(post => post.tags.includes(tag as any))
            .forEach(post => {
              postsWithContext.push({
                ...post,
                projectId: project.id,
                projectTitle: project.title,
                projectStatus: project.status
              });
            });
        });

        return postsWithContext;
      })
    );
  }

  /**
   * Get the next and previous posts for navigation
   */
  getAdjacentPosts(projectId: string, postId: string): Observable<{ prev: DevLogPost | null, next: DevLogPost | null }> {
    return this.getAllPosts(projectId).pipe(
      map(posts => {
        const currentIndex = posts.findIndex(p => p.id === postId);

        if (currentIndex === -1) {
          return { prev: null, next: null };
        }

        return {
          prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
          next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
        };
      })
    );
  }

  /**
   * Get the latest post for a project
   */
  getLatestPost(projectId: string): Observable<DevLogPost | null> {
    return this.getPublishedPosts(projectId).pipe(
      map(posts => {
        if (posts.length === 0) {
          return null;
        }

        // Sort by date descending
        const sorted = posts.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return sorted[0];
      })
    );
  }

  /**
   * Clear the cache (useful for refreshing data)
   */
  clearCache(): void {
    this.devlogsCache$ = null;
  }

  /**
   * Load DevLogs from JSON file
   * Private helper method
   */
  private loadDevLogs(): Observable<DevLogData> {
    return this.http.get<DevLogData>('assets/data/devlogs.json').pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a project summary from a full project object
   * Private helper method
   */
  private createProjectSummary(project: DevLogProject): DevLogProjectSummary {
    const publishedPosts = project.devlogPosts.filter(p => p.status === 'published');
    const sortedPosts = [...publishedPosts].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      id: project.id,
      title: project.title,
      summary: project.summary,
      status: project.status,
      technologies: project.technologies,
      postCount: publishedPosts.length,
      latestPostDate: sortedPosts.length > 0 ? sortedPosts[0].date : project.startDate,
      startDate: project.startDate
    };
  }

  /**
   * Handle HTTP errors
   * Private helper method
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Failed to load DevLogs';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      errorMessage = `Error loading DevLogs (${error.status}): ${error.message}`;
    }

    console.error('DevLog Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
