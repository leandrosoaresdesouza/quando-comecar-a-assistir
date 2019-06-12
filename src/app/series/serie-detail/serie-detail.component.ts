import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SeriesService } from '../../shared/services/series.service';
import { Series } from '../../shared/models/series';
import { Season } from '../../shared/models/season';
import { Episode } from '../../shared/models/episode';
import * as moment from 'moment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-serie-detail',
  templateUrl: './serie-detail.component.html',
  styleUrls: ['./serie-detail.component.scss']
})
export class SerieDetailComponent implements OnInit, OnChanges {

  @Input() selectedSerie: Series;

  mockDate = new Date('2019-03-15');
  calculatorForm: FormGroup;

  seasons$: Season[] = [];
  episodes$: Episode[] = [];
  allEpisodesFromTheSerie: Episode[] = [];
  selectedSeason: Season;
  selectedEpisode: Episode;
  pastEpisodes: number[] = [];
  upcomingEpisodes: object[] = [];

  serieDuration = 0;
  daysAvailableToWatch: number;
  isLoading = false;
  resultWhenToStart: boolean = null;
  resultHoursPerDay: boolean = null;
  serieIsOver = false;
  timePerDay: number;
  timePerDayInHours: number;
  timePerDayInMinutes: number;
  dateToStart: object;
  upcomingEpisode: object;
  time: any;

  constructor(
    private seriesService: SeriesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.calculatorForm = this.formBuilder.group({
      whenToStart: [this.mockDate, []],
      timePerDay: [null, [Validators.max(24), Validators.min(0)]],
    });
  }

  ngOnChanges() {
    this.selectSerie(this.selectedSerie);
  }

  onSubmit(serieId: string) {
    this.isLoading = true;

    this.allEpisodesFromTheSerie = [];
    this.pastEpisodes = [];
    this.upcomingEpisodes = [];
    this.serieDuration = null;
    this.daysAvailableToWatch = null;
    this.resultWhenToStart = null;
    this.resultHoursPerDay = null;
    this.serieIsOver = false;
    this.upcomingEpisode = null;
    this.timePerDay = null;

    this.getAllEpisodesFromSeason(serieId);
  }

  getAllEpisodesFromSeason(serieId: string) {
    this.seasons$.forEach((season) => {
      this.getAllEpisodes(serieId, season.id);
    });
  }

  filterEpisodesByRelease(episodes: Episode[]) {
    episodes.forEach((episode) => {
      const releaseDate = new Date(episode.releaseDate);

      if (releaseDate < this.mockDate) {
        const [first, second] = episode.duration.split(' ');
        const episodeDuration = second
          ? parseInt(first.slice(0, -1), 0) * 60 + parseInt(second.slice(0, -3), 0)
          : parseInt(first.slice(0, -3), 0);
        this.pastEpisodes.push(episodeDuration);
      } else if (episode.releaseDate !== 'Invalid date') {
        this.upcomingEpisodes.push(releaseDate);
      }
    });

    this.getDurationFromPastSeasons(this.pastEpisodes);
    this.getNextEpisode(this.upcomingEpisodes);
  }

  getNextEpisode(upcomingEpisodes) {
    if (upcomingEpisodes.length > 0) {
      const date = new Date(upcomingEpisodes[0]);
      const upcomingEpisode = new Date(date.setDate(date.getDate() + 1));
      this.upcomingEpisode = upcomingEpisode;
      this.getDaysAvailableToWatch(upcomingEpisode);
    } else {
      this.isLoading = false;
      this.serieIsOver = true;
    }
  }

  getDurationFromPastSeasons(pastEpisodes) {
    const serieDuration = pastEpisodes.reduce((a, b) => {
      return a + b;
    });
    this.serieDuration = serieDuration / 60;
  }

  getDaysAvailableToWatch(upcomingEpisode) {
    const whenToStart = this.calculatorForm.controls.whenToStart.value;
    const dayToUpcomingEpisode = moment(upcomingEpisode);
    const dayToStart = moment(whenToStart);
    this.daysAvailableToWatch = dayToUpcomingEpisode.diff(dayToStart, 'days');

    this.result();
  }

  result() {
    const timePerDay = this.calculatorForm.controls.timePerDay.value;
    const whenToStart = this.calculatorForm.controls.whenToStart.value;
    const serieDuration = this.serieDuration;
    const daysAvailableToWatch = this.daysAvailableToWatch;

    if (timePerDay === null) {
      const result = serieDuration / daysAvailableToWatch;
      if (result <= 24) {

        this.time = moment.duration(result, 'hours');
        this.timePerDayInHours = this.time._data.hours;
        this.timePerDayInMinutes = this.time._data.minutes;

        this.resultWhenToStart = true;
        this.serieIsOver = false;
        this.isLoading = false;

      } else {
        this.resultWhenToStart = false;
        this.serieIsOver = false;
        this.isLoading = false;
      }
    } else {
      const timeToWatch = timePerDay * daysAvailableToWatch;
      if (timeToWatch > serieDuration) {
        const timeLeftOver = timeToWatch - serieDuration;
        const date = moment(whenToStart).add(timeLeftOver, 'hours');
        this.dateToStart = date;

        this.resultHoursPerDay = true;
        this.serieIsOver = false;
        this.isLoading = false;
      } else {

        this.time = moment.duration(timePerDay, 'hours');
        this.timePerDayInHours = this.time._data.hours;
        this.timePerDayInMinutes = this.time._data.minutes;

        this.resultHoursPerDay = false;
        this.serieIsOver = false;
        this.isLoading = false;
      }
    }
  }

  selectSerie(serie: Series) {
    this.selectedSerie = serie;
    this.reset(serie);
  }

  reset(serie: Series) {
    this.seasons$ = [];
    this.episodes$ = [];
    this.allEpisodesFromTheSerie = [];
    this.pastEpisodes = [];
    this.upcomingEpisodes = [];
    this.serieDuration = null;
    this.daysAvailableToWatch = null;
    this.resultWhenToStart = null;
    this.resultHoursPerDay = null;
    this.serieIsOver = false;
    this.upcomingEpisode = null;
    this.timePerDay = null;

    if (serie) {
      this.getSeasons(serie.id);
    }
  }

  getSeasons(serieId: string) {
    this.seriesService.getSeasons(serieId).subscribe((res: Season[]) => {
      this.seasons$ = res;
    }, err => {
      this.snackBar.open('Ocorreu um erro ao buscar as temporadas', 'OK', { duration: 4000 });
    });
  }

  selectSeason(season: Season) {
    this.selectedSeason = season;
    this.getEpisodes(this.selectedSerie.id, season.id);
  }

  getEpisodes(serieId: string, seasonId: string) {
    return this.seriesService.getEpisodes(serieId, seasonId).subscribe((res: Episode[]) => {
      this.episodes$ = res;
    }, err => {
      this.snackBar.open('Ocorreu um erro ao buscar os episódios', 'OK', { duration: 4000 });
    });
  }

  getAllEpisodes(serieId: string, seasonId: string) {
    return this.seriesService.getEpisodes(serieId, seasonId).subscribe((res: Episode[]) => {
      this.allEpisodesFromTheSerie = res;
      this.filterEpisodesByRelease(this.allEpisodesFromTheSerie);
    }, err => {
      this.snackBar.open('Ocorreu um erro ao buscar os episódios', 'OK', { duration: 4000 });
    });
  }

  selectEpisode(episode: Episode) {
    this.selectedEpisode = episode;
  }

}
