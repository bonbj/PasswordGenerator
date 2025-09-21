import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Importar configuração do storage
import './storage/simple-storage.service';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
