import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeriesService } from './shared/services/series.service';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { SeriesComponent } from './series/series.component';
import { SerieDetailComponent } from './series/serie-detail/serie-detail.component';
import { SerieListComponent } from './series/serie-list/serie-list.component';
import { HeaderComponent } from './series/components/header/header.component';
import { SidebarComponent } from './series/components/sidebar/sidebar.component';
import { FilterPipe } from './shared/pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SeriesComponent,
    SerieDetailComponent,
    SerieListComponent,
    HeaderComponent,
    SidebarComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
  ],
  providers: [
    SeriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
