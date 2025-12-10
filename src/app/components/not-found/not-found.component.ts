import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <!-- 404 Illustration -->
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-blue-600 dark:text-blue-400">404</h1>
          <div class="mt-4">
            <svg class="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Error Message -->
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            (click)="goBack()"
            class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
            Go Back
          </button>
          <button
            (click)="goHome()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Go to Home
          </button>
        </div>

        <!-- Quick Links -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Or try one of these pages:
          </p>
          <div class="flex flex-wrap gap-3 justify-center">
            <button
              (click)="navigateTo('/devlogs')"
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              DevLogs
            </button>
            <span class="text-gray-400">•</span>
            <button
              (click)="navigateTo('/gallery')"
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Gallery
            </button>
            <span class="text-gray-400">•</span>
            <button
              (click)="navigateTo('/')"
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
