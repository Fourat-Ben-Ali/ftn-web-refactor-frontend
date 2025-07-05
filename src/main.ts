import '@angular/compiler';
import { Chart, registerables } from 'chart.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Register Chart.js components
Chart.register(...registerables);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
