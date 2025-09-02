import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app/routes';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';


bootstrapApplication(
  App,
  {
    ...appConfig,
    providers: [
      importProvidersFrom(AppRoutingModule),
      provideHttpClient(withFetch())
    ]
  }
).catch((err) => console.error(err));
