import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export interface DeckProps {
  name: string;
  playerId: UniqueEntityID;
}

export class Deck extends Entity<DeckProps> {
  get name() {
    return this.props.name;
  }

  get playerId() {
    return this.props.playerId;
  }

  static create(props: DeckProps, id?: UniqueEntityID) {
    const deck = new Deck(props, id);

    return deck;
  }
}
