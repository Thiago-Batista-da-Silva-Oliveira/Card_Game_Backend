import { WatchedList } from '@/core/entities/watched-list';
import { CurrentCardState } from './CurrentCardState';

export class CurrentCardStateWatchedList extends WatchedList<CurrentCardState> {
  compareItems(a: CurrentCardState, b: CurrentCardState): boolean {
    return a.id.equals(b.id);
  }
}
