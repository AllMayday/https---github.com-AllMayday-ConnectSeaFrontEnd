import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManifestoForm } from './manifesto-form/manifesto-form';
import { ManifestoList } from './manifesto-list/manifesto-list';

const routes: Routes = [
  { path: '', component: ManifestoList },
  { path: 'new', component: ManifestoForm },
  { path: 'edit/:id', component: ManifestoForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManifestosRoutingModule { }
