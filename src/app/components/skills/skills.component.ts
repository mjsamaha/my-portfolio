import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService, SkillCategory } from '../../services/api.service';
import { IconService, IconData } from '../../services/icon.service';
import { Observable, map } from 'rxjs';

export interface SkillWithIcon {
  name: string;
  level: number;
  description?: string;
  iconData: IconData;
}

export interface SkillCategoryWithIcons extends SkillCategory {
  skills: SkillWithIcon[];
  colorScheme: { bg: string; border: string; text: string };
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit {
  skills$: Observable<SkillCategoryWithIcons[]> | undefined;
  otherTechnologies$: Observable<SkillCategoryWithIcons | null> | undefined;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private iconService: IconService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadSkills();
  }

  private loadSkills(): void {
    // Pre-fetch icons for better performance
    this.apiService.getSkills().subscribe(skills => {
      skills.forEach(category => {
        category.skills.forEach(skill => {
          // Pre-load icons into cache
          this.iconService.getIcon(skill.name);
        });
      });
    });

    this.skills$ = this.apiService.getSkills().pipe(
      map(skills => {
        // Separate main skills from "Other Technologies"
        const mainSkills = skills.filter(cat => cat.category !== 'Other Technologies & Methods');

        // Process main skills
        return mainSkills.map(category => ({
          ...category,
          skills: category.skills.map(skill => ({
            ...skill,
            iconData: this.iconService.getIcon(skill.name)
          })),
          colorScheme: this.iconService.getCategoryColor(category.category)
        }));
      })
    );

    // Process other technologies separately
    this.otherTechnologies$ = this.apiService.getSkills().pipe(
      map(skills => {
        const otherTech = skills.find(cat => cat.category === 'Other Technologies & Methods');
        if (!otherTech) return null;
        
        return {
          ...otherTech,
          skills: otherTech.skills.map(skill => ({
            ...skill,
            iconData: this.iconService.getIcon(skill.name)
          })),
          colorScheme: { bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', text: 'text-gray-900' }
        };
      })
    );
  }

  trackBySkill(index: number, skill: SkillWithIcon): string {
    return skill.name;
  }

  trackByCategory(index: number, category: SkillCategoryWithIcons): string {
    return category.category;
  }

  getSanitizedSvg(iconData: IconData): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(iconData.svg);
  }
}
