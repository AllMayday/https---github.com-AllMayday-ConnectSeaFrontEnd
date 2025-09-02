import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './home/home';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './routes';
import { NaviosModule } from './navios/navios-module';
import { AgendasModule } from './agendas/agendas-module';
import { ManifestosModule } from './manifestos/manifestos-module';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    AgendasModule,
    ManifestosModule,
    NaviosModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ConnectSeaFront');
}
