import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Initialize Firebase SDK (imports side-effectful initializer)
import './app/firebase-init';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
