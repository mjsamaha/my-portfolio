import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    GalleryComponent,
    ContactComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header with Navigation -->
      <app-header></app-header>

      <!-- Main Content Area -->
      <main class="flex-1">
        <app-about></app-about>
        <app-skills></app-skills>
        <app-experience></app-experience>
        <app-projects></app-projects>
        <app-gallery></app-gallery>
        <app-contact></app-contact>
      </main>

      <!-- Footer -->
      <app-footer></app-footer>
    </div>
  `
})
export class HomeComponent {
}

