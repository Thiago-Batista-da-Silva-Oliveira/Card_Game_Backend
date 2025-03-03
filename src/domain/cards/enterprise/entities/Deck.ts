import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';
import { DeckHasCardWatchedList } from './DeckHasCardsWatchedList';

export interface DeckProps {
  name: string;
  playerId: UniqueEntityID;
  deckHasCards?: DeckHasCardWatchedList;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Deck extends Entity<DeckProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get playerId() {
    return this.props.playerId;
  }

  get deckHasCards() {
    return this.props.deckHasCards ?? new DeckHasCardWatchedList();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set deckHasCards(deckHasCards: DeckHasCardWatchedList) {
    this.props.deckHasCards = deckHasCards;
  }

  static create(props: DeckProps, id?: UniqueEntityID) {
    const deck = new Deck(props, id);

    return deck;
  }
}
