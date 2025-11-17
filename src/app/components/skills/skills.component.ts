import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, SkillCategory } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit {
  skills$: Observable<SkillCategory[]> | undefined;
  error: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSkills();
  }

  private loadSkills(): void {
    this.skills$ = this.apiService.getSkills();
  }
}
