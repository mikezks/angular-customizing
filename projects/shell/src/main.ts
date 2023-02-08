import { initFederation } from '@angular-architects/module-federation';

initFederation('/assets/config/mf.manifest.json')
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
