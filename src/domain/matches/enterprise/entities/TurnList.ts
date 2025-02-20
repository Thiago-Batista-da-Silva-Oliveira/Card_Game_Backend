import { WatchedList } from '@/core/entities/watched-list';
import { Turn } from './Turn';

export class TurnWatchedList extends WatchedList<Turn> {
  compareItems(a: Turn, b: Turn): boolean {
    return a.id.equals(b.id);
  }
}
