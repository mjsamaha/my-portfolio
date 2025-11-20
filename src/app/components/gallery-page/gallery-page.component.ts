import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BirdPhotoModalComponent, BirdPhoto } from '../bird-photo-modal/bird-photo-modal.component';
import { getImagePath } from '../../utils/image.utils';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BirdPhotoModalComponent],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.css'
})
export class GalleryPageComponent {
  birdPhotos: BirdPhoto[] = [
    {
      filename: 'RedTailedHawk.jpg',
      commonName: 'Red-tailed Hawk',
      scientificName: 'Buteo jamaicensis',
      location: 'Cootes Paradise, Hamilton, ON',
    },
    {
      filename: 'Osprey.jpg',
      commonName: 'Osprey',
      scientificName: 'Pandion haliaetus',
      location: 'Rattray Marsh, Mississauga, ON',
    },
    {
      filename: 'RedNeckedGrebe.jpg',
      commonName: 'Red-necked Grebe',
      scientificName: 'Podiceps grisegena',
      location: 'Colonel Samuel Smith Park, Toronto, ON',
    },
    {
      filename: 'RedNeckedGrebe1.jpg',
      commonName: 'Red-necked Grebe',
      scientificName: 'Podiceps grisegena',
      location: 'Colonel Samuel Smith Park, Toronto, ON',
    },
    {
      filename: 'RedNeckedGrebe2.jpg',
      commonName: 'Red-necked Grebe',
      scientificName: 'Podiceps grisegena',
      location: 'Colonel Samuel Smith Park, Toronto, ON',
    },
    {
      filename: 'RedBrestedMerganser.jpg',
      commonName: 'Red-breasted Merganser',
      scientificName: 'Mergus serrator',
      location: 'Rattray Marsh, Mississauga, ON',
    },
    {
      filename: 'LesserYellowlegs.jpg',
      commonName: 'Lesser Yellowlegs',
      scientificName: 'Tringa flavipes',
      location: 'Rattray Marsh, Mississauga, ON',
    },
    {
      filename: 'CooperHawk.jpg',
      commonName: "Cooper's Hawk",
      scientificName: 'Accipiter cooperii',
      location: 'Greater Toronto Area, ON',
    },
    {
      filename: 'CooperHawk1.jpg',
      commonName: "Cooper's Hawk",
      scientificName: 'Accipiter cooperii',
      location: 'Greater Toronto Area, ON',
    },
    {
      filename: 'CooperHawk2.jpg',
      commonName: "Cooper's Hawk",
      scientificName: 'Accipiter cooperii',
      location: 'Greater Toronto Area, ON',
    },
    {
      filename: 'CooperHawk3.jpg',
      commonName: "Cooper's Hawk",
      scientificName: 'Accipiter cooperii',
      location: 'Greater Toronto Area, ON',
    },
    {
      filename: 'EasternKingbird.jpg',
      commonName: 'Eastern Kingbird',
      scientificName: 'Tyrannus tyrannus',
      location: 'Greater Toronto Area, ON',
    },
    {
      filename: 'GrayCatbird.jpg',
      commonName: 'Gray Catbird',
      scientificName: 'Dumetella carolinensis',
      location: 'Greater Toronto Area, ON',
    },
    {
      filename: 'Merlin.jpg',
      commonName: 'Merlin',
      scientificName: 'Falco columbarius',
      location: 'Greater Toronto Area, ON',
    },
  ];

  isModalOpen = false;
  modalImageIndex = 0;

  // Helper method to get image path
  getImagePath(filename: string): string {
    return getImagePath(filename);
  }

  // TrackBy function for performance
  trackByPhoto(index: number, photo: BirdPhoto): string {
    return photo.filename;
  }

  // Handle image loading errors
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.warn(`Failed to load image: ${target.src}`);
    target.style.display = 'none';
  }

  // Modal functionality
  openModal(index: number): void {
    this.modalImageIndex = index;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  // Modal navigation
  prevModalImage(): void {
    this.modalImageIndex = (this.modalImageIndex - 1 + this.birdPhotos.length) % this.birdPhotos.length;
  }

  nextModalImage(): void {
    this.modalImageIndex = (this.modalImageIndex + 1) % this.birdPhotos.length;
  }
}

