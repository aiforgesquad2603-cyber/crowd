import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// This function starts up your Angular application by loading the root module
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error('Error bootstrapping the application:', err));