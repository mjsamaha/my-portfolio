import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BirdPhoto {
  filename: string;
  commonName: string;
  scientificName: string;
  location: string;
  description?: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
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
      filename: 'RedNeckedGrebe1.jpg',
      commonName: "Red Necked Grebe",
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
    }
  ];

  currentIndex = 0;
  isModalOpen = false;
  modalImageIndex = 0;

  // Helper method to get image path
  getImagePath(filename: string): string {
    return `assets/images/${filename}`;
  }

  // TrackBy function for performance
  trackByPhoto(index: number, photo: BirdPhoto): string {
    return photo.filename;
  }

  // Handle image loading errors
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.warn(`Failed to load image: ${target.src}`);
    // You could set a fallback image here if needed
    target.style.display = 'none';
  }

  // Carousel navigation
  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.birdPhotos.length) % this.birdPhotos.length;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.birdPhotos.length;
  }

  goToImage(index: number): void {
    this.currentIndex = index;
  }

  // Modal functionality
  openModal(index: number): void {
    this.modalImageIndex = index;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Modal navigation
  prevModalImage(): void {
    this.modalImageIndex = (this.modalImageIndex - 1 + this.birdPhotos.length) % this.birdPhotos.length;
  }

  nextModalImage(): void {
    this.modalImageIndex = (this.modalImageIndex + 1) % this.birdPhotos.length;
  }

  // Keyboard navigation for modal
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isModalOpen) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.prevModalImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextModalImage();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeModal();
        break;
    }
  }
}
