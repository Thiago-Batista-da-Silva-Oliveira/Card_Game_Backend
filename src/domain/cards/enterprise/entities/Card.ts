import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export interface CardProps {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Card extends Entity<CardProps> {
  get name() {
    return this.props.name;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  static create(props: CardProps, id?: UniqueEntityID) {
    const card = new Card(props, id);

    return card;
  }
}
