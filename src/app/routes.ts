import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';

const routes: Routes = [
    { path: '', component: Home, title: 'Home' },
    { path: 'agendas', loadChildren: () => import('./agendas/agendas-module').then(m => m.AgendasModule), title: 'Agendas' },
    { path: 'manifestos', loadChildren: () => import('./manifestos/manifestos-module').then(m => m.ManifestosModule), title: 'Manifestos' },
    { path: 'navios', loadChildren: () => import('./navios/navios-module').then(m => m.NaviosModule), title: 'Navios' },
    { path: 'details', component: Details, title: 'Details' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

//export default routeConfig;