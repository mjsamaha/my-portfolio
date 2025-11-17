import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }

  async onSubmit() {
    if (this.contactForm.valid && isPlatformBrowser(this.platformId)) {
      this.isSubmitting = true;
      this.submitError = '';

      try {
        // Formspree endpoint - replace YOUR_FORM_ID with actual Formspree form ID
        const formData = new FormData();

        Object.keys(this.contactForm.value).forEach(key => {
          formData.append(key, this.contactForm.value[key]);
        });

        // Formspree endpoint for portfolio contact form
        const response = await fetch('https://formspree.io/f/xzzyodkv', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          this.isSubmitted = true;
          this.contactForm.reset();
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        this.submitError = 'Failed to send message. Please try again or contact directly.';
        console.error('Contact form error:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.contactForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.submitError = '';
    this.contactForm.reset();
  }
}
