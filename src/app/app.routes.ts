import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GalleryPageComponent } from './components/gallery-page/gallery-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gallery', component: GalleryPageComponent },
  { path: '**', component: NotFoundComponent }
];
