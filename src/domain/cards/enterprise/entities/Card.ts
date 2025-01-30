import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export interface CardProps {
  name: string;
}

export class Card extends Entity<CardProps> {
  get name() {
    return this.props.name;
  }
  static create(props: CardProps, id?: UniqueEntityID) {
    const card = new Card(props, id);

    return card;
  }
}
