import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavioForm } from './navio-form/navio-form';
import { NavioList } from './navio-list/navio-list';

const routes: Routes = [
  { path: '', component: NavioList },
  { path: 'new', component: NavioForm },
  { path: 'edit/:id', component: NavioForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaviosRoutingModule { }
