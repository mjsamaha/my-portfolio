import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GalleryPageComponent } from './components/gallery-page/gallery-page.component';
import { AllDevlogsComponent } from './components/all-devlogs/all-devlogs.component';
import { DevlogPageComponent } from './components/devlog-page/devlog-page.component';
import { DevlogPostComponent } from './components/devlog-post/devlog-post.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gallery', component: GalleryPageComponent },
  { path: 'devlogs', component: AllDevlogsComponent },
  { path: 'projects/:projectId/devlog', component: DevlogPageComponent },
  { path: 'projects/:projectId/devlog/:postId', component: DevlogPostComponent },
  { path: '**', component: NotFoundComponent }
];
