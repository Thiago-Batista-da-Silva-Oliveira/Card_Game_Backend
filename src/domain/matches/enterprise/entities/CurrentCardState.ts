import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export interface CurrentCardStateProps {
  cardId: UniqueEntityID;
  playerId: UniqueEntityID;
  position: number;
  attackModification?: number;
  deffenseModification?: number;
}

export class CurrentCardState extends Entity<CurrentCardStateProps> {
  get cardId() {
    return this.props.cardId;
  }

  get playerId() {
    return this.props.playerId;
  }

  get position() {
    return this.props.position;
  }

  get attackModification() {
    return this.props.attackModification;
  }

  get deffenseModification() {
    return this.props.deffenseModification;
  }

  static create(props: CurrentCardStateProps, id?: UniqueEntityID) {
    const currentCardsState = new CurrentCardState(props, id);

    return currentCardsState;
  }
}
