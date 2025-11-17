import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link: string;
  thumbnail: string;
  status: string;
  category: string;
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: number;
  }[];
}

export interface Experience {
  id: number;
  type: 'work' | 'education';
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`)
      .pipe(
        catchError(() => this.loadLocalProjects())
      );
  }

  getSkills(): Observable<SkillCategory[]> {
    return this.http.get<SkillCategory[]>(`${environment.apiUrl}/skills`)
      .pipe(
        catchError(() => this.loadLocalSkills())
      );
  }

  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${environment.apiUrl}/experience`)
      .pipe(
        catchError(() => this.loadLocalExperience())
      );
  }

  private loadLocalProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('assets/data/projects.json');
  }

  private loadLocalSkills(): Observable<SkillCategory[]> {
    return this.http.get<SkillCategory[]>('assets/data/skills.json');
  }

  private loadLocalExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>('assets/data/experience.json');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.status === 0) {
        errorMessage = 'Backend server is not running. Please start the server with "npm start" in the backend directory.';
      } else {
        errorMessage = `Backend error (code: ${error.status}): ${error.error.message || error.message}`;
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
