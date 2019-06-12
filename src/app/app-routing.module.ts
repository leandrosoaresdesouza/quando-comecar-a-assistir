import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesComponent } from './series/series.component';

const routes: Routes = [
  { path: '', redirectTo: '/series', pathMatch: 'full' },
  { path: '**', redirectTo: '/series', pathMatch: 'full' },
  { path: 'series', component: SeriesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
