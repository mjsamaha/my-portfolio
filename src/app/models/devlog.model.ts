/**
 * DevLog Models and Interfaces
 * Defines the structure for project development logs and blog posts
 */

/**
 * Project status enumeration
 */
export type ProjectStatus = 'in-progress' | 'completed' | 'on-hold';

/**
 * Post tag types for categorization
 */
export type PostTag = 'feature' | 'bug-fix' | 'milestone' | 'design' | 'refactor' | 'testing' | 'deployment' | 'documentation';

/**
 * Post status for draft vs published
 */
export type PostStatus = 'draft' | 'published';

/**
 * Individual DevLog blog post
 */
export interface DevLogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: PostTag[];
  status: PostStatus;
  images?: string[];
  readingTime?: number;
}

/**
 * Project with associated DevLog information
 */
export interface DevLogProject {
  id: string;
  title: string;
  summary: string;
  detailedSummary: string;
  startDate: string;
  expectedEndDate?: string;
  completionDate?: string;
  status: ProjectStatus;
  technologies: string[];
  repository?: string;
  liveUrl?: string;
  devlogPosts: DevLogPost[];
}

/**
 * Root DevLog data structure
 */
export interface DevLogData {
  projects: DevLogProject[];
}

/**
 * DevLog post with project context for display
 */
export interface DevLogPostWithContext extends DevLogPost {
  projectId: string;
  projectTitle: string;
  projectStatus: ProjectStatus;
}

/**
 * Project summary for listings
 */
export interface DevLogProjectSummary {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  technologies: string[];
  postCount: number;
  latestPostDate: string;
  startDate: string;
}
