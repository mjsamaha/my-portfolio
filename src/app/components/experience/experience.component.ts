import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Experience } from '../../services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnInit {
  workExperiences$: Observable<Experience[]> | undefined;
  educationExperiences$: Observable<Experience[]> | undefined;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadExperience();
  }

  private loadExperience(): void {
    const allExperience$ = this.apiService.getExperience();

    this.workExperiences$ = allExperience$.pipe(
      map(experiences => experiences.filter(exp => exp.type === 'work'))
    );

    this.educationExperiences$ = allExperience$.pipe(
      map(experiences => experiences.filter(exp => exp.type === 'education'))
    );
  }

  trackByFn(index: number, item: Experience): number {
    return item.id;
  }

  formatDateRange(exp: Experience): string {
    const startYear = exp.startDate.split('-')[0];
    const endDate = exp.endDate === 'Present' ? 'Present' : exp.endDate.split('-')[0];
    return `${startYear} - ${endDate}`;
  }
}
