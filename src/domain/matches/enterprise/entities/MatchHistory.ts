/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export enum ACTION {
  ATTACK = 'ATTACK',
  PROTECT = 'PROTECT', 
  SUMMON = 'SUMMON',
}

export type ActionDescription =
  | { type: ACTION.ATTACK; damage: number; targetId: UniqueEntityID }
  | { type: ACTION.PROTECT; shieldAmount: number }
  | { type: ACTION.SUMMON; summonedEntityId: UniqueEntityID };

export interface MatchHistoryProps {
  matchId: UniqueEntityID;
  playerId: UniqueEntityID;
  masterActionId?: UniqueEntityID;
  action: ACTION;
  actionDescription: any;
  createdAt?: Date;
  chainedActions?: MatchHistoryProps[];
}

export class MatchHistory extends Entity<MatchHistoryProps> {
  get playerId() {
    return this.props.playerId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get masterActionId () {
    return this.props.masterActionId;
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
    if (!props.createdAt) {
      props.createdAt = new Date();
    }
    const matchHistory = new MatchHistory(props, id);

    return matchHistory;
  }
}
