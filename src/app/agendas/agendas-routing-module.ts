import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaList } from './agenda-list/agenda-list';
import { AgendaForm } from './agenda-form/agenda-form';

const routes: Routes = [
  { path: '', component: AgendaList },
  { path: 'new', component: AgendaForm },
  { path: 'edit/:id', component: AgendaForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendasRoutingModule { }
