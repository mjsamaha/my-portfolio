This folder contains Firebase Cloud Functions used by the site.

Endpoints:
- `projects` (HTTP): returns JSON array of projects from `functions/data/projects.json`.

Deployment:
- Run `npm --prefix functions ci` to install dependencies for functions.
- Run `firebase deploy --only functions` to deploy.

Notes:
- If you want the functions to read the latest built `dist` assets, ensure the data is copied into `functions/data/` during your build or CI step.
