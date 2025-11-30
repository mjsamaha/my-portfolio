import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from '../environments/firebase.config';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environments
try {
  if (typeof window !== 'undefined') {
    getAnalytics(app);
  }
} catch (e) {
  // Analytics may fail in non-browser environments; ignore.
}

export { app };
