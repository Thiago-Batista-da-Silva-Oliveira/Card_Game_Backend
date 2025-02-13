import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';
import { PlayersInMatchProps } from './PlayersInMatch';
import { TurnProps } from './Turn';

export interface MatchProps {
  winnerId?: UniqueEntityID;
  finishedAt?: Date;
  status?: 'open' | 'finished';
  createdAt?: Date;
  updatedAt?: Date;
  playersInMatch?: PlayersInMatchProps[];
  currentTurn?: number;
  turns: TurnProps[];
}

export class Match extends Entity<MatchProps> {
  touch() {
    this.props.updatedAt = new Date();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get playersInMatch() {
    return this.props.playersInMatch;
  }

  set playersInMatch(playersInMatch) {
    this.props.playersInMatch = playersInMatch;
  }

  get winnerId() {
    return this.props.winnerId;
  }

  set winnerId(winnerId) {
    this.props.winnerId = winnerId;
    this.touch();
  }

  get finishedAt() {
    return this.props.finishedAt;
  }

  set finishedAt(finishedAt) {
    this.props.finishedAt = finishedAt;
    this.touch();
  }

  get status() {
    return this.props.status;
  }

  set status(status) {
    this.props.status = status;
    this.touch();
  }

  get currentTurn() {
    return this.props.currentTurn;
  }

  set currentTurn(currentTurn) {
    this.props.currentTurn = currentTurn;
    this.touch();
  }

  get turns() {
    return this.props.turns;
  }

  set turns(turns) {
    this.props.turns = turns;
    this.touch();
  }

  static create(props: MatchProps, id?: UniqueEntityID) {
    if (!props.currentTurn) {
      props.currentTurn = 1;
    }
    if (!props.status) {
      props.status = 'open';
    }
    const match = new Match(props, id);

    return match;
  }
}
