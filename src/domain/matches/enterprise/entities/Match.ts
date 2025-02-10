import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';
import { PlayersInMatchProps } from './PlayersInMatch';
import { MatchHistory } from './MatchHistory';

export interface MatchProps {
  winnerId?: UniqueEntityID;
  finishedAt?: Date;
  status?: 'open' | 'finished';
  createdAt?: Date;
  updatedAt?: Date;
  playersInMatchProps?: PlayersInMatchProps[];
  matchHistory?: MatchHistory[];
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

  get playersInMatchProps() {
    return this.props.playersInMatchProps;
  }

  set playersInMatchProps(playersInMatchProps) {
    this.props.playersInMatchProps = playersInMatchProps;
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
    this.touch();
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

  static create(props: MatchProps, id?: UniqueEntityID) {
    if (!props.status) {
      props.status = 'open';
    }
    const match = new Match(props, id);

    return match;
  }
}
