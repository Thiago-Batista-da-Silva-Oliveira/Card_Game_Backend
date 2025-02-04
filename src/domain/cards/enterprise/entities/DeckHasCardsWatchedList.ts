import { WatchedList } from '@/core/entities/watched-list';
import { DeckHasCards } from './DeckHasCards';

export class DeckHasCardWatchedList extends WatchedList<DeckHasCards> {
  compareItems(a: DeckHasCards, b: DeckHasCards): boolean {
    return a.cardId.equals(b.cardId);
  }
}
