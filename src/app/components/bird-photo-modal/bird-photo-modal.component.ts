import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getImagePath } from '../../utils/image.utils';

export interface BirdPhoto {
  filename: string;
  commonName: string;
  scientificName: string;
  location: string;
  description?: string;
}

@Component({
  selector: 'app-bird-photo-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bird-photo-modal.component.html',
  styleUrl: './bird-photo-modal.component.css'
})
export class BirdPhotoModalComponent implements OnChanges {
  @Input() photos: BirdPhoto[] = [];
  @Input() currentIndex: number = 0;
  @Input() isOpen: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  // Helper method to get image path
  getImagePath(filename: string): string {
    return getImagePath(filename);
  }

  // Handle image loading errors
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.warn(`Failed to load image: ${target.src}`);
    target.style.display = 'none';
  }

  // Handle modal open/close for body scroll lock
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  // Handle close
  onClose(): void {
    this.close.emit();
  }

  // Handle next
  onNext(): void {
    this.next.emit();
  }

  // Handle previous
  onPrevious(): void {
    this.previous.emit();
  }

  // Keyboard navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.onPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.onNext();
        break;
      case 'Escape':
        event.preventDefault();
        this.onClose();
        break;
    }
  }

  // Get current photo
  get currentPhoto(): BirdPhoto | null {
    if (!this.photos || this.photos.length === 0 || this.currentIndex < 0 || this.currentIndex >= this.photos.length) {
      return null;
    }
    return this.photos[this.currentIndex];
  }

  // Check if navigation should be shown
  get showNavigation(): boolean {
    return this.photos && this.photos.length > 1;
  }
}

