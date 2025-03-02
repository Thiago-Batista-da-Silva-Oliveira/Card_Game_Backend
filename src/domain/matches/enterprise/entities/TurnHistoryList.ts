import { WatchedList } from '@/core/entities/watched-list';
import { TurnHistory } from './TurnHistory';

export class TurnHistoryWatchedList extends WatchedList<TurnHistory> {
  compareItems(a: TurnHistory, b: TurnHistory): boolean {
    return a.id.equals(b.id);
  }
}
