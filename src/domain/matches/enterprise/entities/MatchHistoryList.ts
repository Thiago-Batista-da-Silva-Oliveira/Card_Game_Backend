import { WatchedList } from '@/core/entities/watched-list';
import { MatchHistory } from './MatchHistory';

export class MatchHistoryWatchedList extends WatchedList<MatchHistory> {
  compareItems(a: MatchHistory, b: MatchHistory): boolean {
    return a.id.equals(b.id);
  }
}
