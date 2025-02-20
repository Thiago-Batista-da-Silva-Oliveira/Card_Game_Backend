import { WatchedList } from '@/core/entities/watched-list';
import { PlayersInMatch } from './PlayersInMatch';

export class PlayersInMatchWatchedList extends WatchedList<PlayersInMatch> {
  compareItems(a: PlayersInMatch, b: PlayersInMatch): boolean {
    return a.id.equals(b.id);
  }
}
