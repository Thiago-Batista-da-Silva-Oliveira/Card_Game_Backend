/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export enum ACTION {
  ATTACK,
  PROCTED,
  SUMMON,
}

export interface MatchHistoryProps {
  matchId: UniqueEntityID;
  playerId: UniqueEntityID;
  action: ACTION;
  actionDescription: any;
}

export class MatchHistory extends Entity<MatchHistoryProps> {
  get playerId() {
    return this.props.playerId;
  }
  get matchId() {
    return this.props.matchId;
  }

  get action() {
    return this.props.action;
  }

  get actionDescription() {
    return this.props.actionDescription;
  }

  static create(props: MatchHistoryProps, id?: UniqueEntityID) {
    const matchHistory = new MatchHistory(props, id);

    return matchHistory;
  }
}
