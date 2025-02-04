import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export interface DeckHasCardsProps {
  cardId: UniqueEntityID;
  deckId: UniqueEntityID;
}

export class DeckHasCards extends Entity<DeckHasCardsProps> {
  get cardId() {
    return this.props.cardId;
  }
  get deckId() {
    return this.props.deckId;
  }
  static create(props: DeckHasCardsProps, id?: UniqueEntityID) {
    const deckHasCards = new DeckHasCards(props, id);

    return deckHasCards;
  }
}
