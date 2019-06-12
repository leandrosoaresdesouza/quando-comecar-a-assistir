import { Pipe, PipeTransform } from '@angular/core';
import { Episode } from '../models/episode';

@Pipe({
  name: 'episodeFilter'
})
export class FilterPipe implements PipeTransform {

  transform(episodes: Episode[], searchTerm: string): Episode[] {
    if (!episodes || !searchTerm) {
      return episodes;
    }

    return episodes.filter(episode =>
      episode.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }

}
