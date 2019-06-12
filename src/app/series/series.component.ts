import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../shared/services/series.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {

  modeSidenav = 'side';
  screenWidth: number;

  constructor(
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
  }

}
