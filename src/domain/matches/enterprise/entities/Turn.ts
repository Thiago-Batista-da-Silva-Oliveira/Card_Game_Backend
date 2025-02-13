import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';
import { MatchHistory } from './MatchHistory';

export enum TURN_STATUS {
  WAITING_RESPONSE = 'WAITING_RESPONSE',
  MAKING_THE_PLAY = 'MAKING_THE_PLAY',
  STATUS = 'FINISHED',
}

export interface TurnProps {
  turn: number;
  playerId: UniqueEntityID;
  matchId: UniqueEntityID;
  status: TURN_STATUS;
  historic?: MatchHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Turn extends Entity<TurnProps> {
  get playerId() {
    return this.props.playerId;
  }

  get turn() {
    return this.props.turn;
  }

  get status() {
    return this.props.status;
  }

  get historic() {
    return this.props.historic;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get matchId() {
    return this.props.matchId;
  }

  static create(props: TurnProps, id?: UniqueEntityID) {
    if (!props.updatedAt) {
      props.updatedAt = new Date();
    }

    if (!props.createdAt) {
      props.createdAt = new Date();
    }

    const turn = new Turn(props, id);

    return turn;
  }
}
