import { Component, OnInit} from '@angular/core';
import { SeriesService } from '../../shared/services/series.service';
import { Series } from '../../shared/models/series';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-serie-list',
  templateUrl: './serie-list.component.html',
  styleUrls: ['./serie-list.component.scss']
})
export class SerieListComponent implements OnInit {

  series$: Series[] = [];
  selectedSerie: Series;

  constructor(
    private seriesService: SeriesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.seriesService.getSeries().subscribe((res: Series[]) => {
      this.series$ = res;
    }, err => {
      this.snackBar.open('Ocorreu um erro ao buscar os episódios', 'OK', { duration: 4000 });
    });
  }

  selectSerie(serie: Series) {
    this.selectedSerie = serie;
  }

}
