import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Series } from '../models/series';
import { Season } from '../models/season';
import { Episode } from '../models/episode';

@Injectable({
  providedIn: 'root'
})

export class SeriesService {

  readonly url = environment.APIEndPoint;
  constructor(private http: HttpClient) { }

  getSeries(): Observable<Series[]> {
    return this.http.get<Series[]>(`${this.url}/series`);
  }

  getSerieById(serie: Series): Observable<Series> {
    return this.http.get<Series>(`${this.url}/series/${serie}`);
  }

  getSeasons(serieId: string): Observable<Season[]> {
    return this.http.get<Season[]>(`${this.url}/series/${serieId}/seasons`);
  }

  getSeasonById(serieId: string, seasonId: string): Observable<Series> {
    return this.http.get<Series>(`${this.url}/series/${serieId}/seasons/${seasonId}`);
  }

  getEpisodes(serieId: string, seasonId: string): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.url}/series/${serieId}/seasons/${seasonId}/episodes`);
  }

  getEpisodeById(serie: Series, season: Season, episode: Episode): Observable<Series> {
    return this.http.get<Series>(`${this.url}/series/${serie}/seasons/${season}/episodes/${episode}`);
  }

}
