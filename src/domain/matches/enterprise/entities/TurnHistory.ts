/* eslint-disable prettier/prettier */
import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export enum ACTION {
  ATTACK = 'ATTACK',
  PROTECT = 'PROTECT', 
  SUMMON = 'SUMMON',
}

enum ACTION_RESULT {
  BLOCKED = 'BLOCKED',
  DIRECT_ATTACK = 'DIRECT_ATTACK'
}

export type ActionDescription =
  | { type: ACTION.ATTACK; attackerId: number; damage: number; targetId: UniqueEntityID }
  | { type: ACTION.PROTECT; defenderId: number; shieldAmount: number }
  | { type: ACTION.SUMMON; cardId: UniqueEntityID; position: number; playerId: UniqueEntityID; };

type ActionResult = 
  | { type: ACTION_RESULT.BLOCKED; attackerId: number; attackerReducedLife: number; targetId: number; targetIdReducedLift: number}
  | { type: ACTION_RESULT.DIRECT_ATTACK; reducedLife: number}

export interface TurnHistoryProps {
  turnId: UniqueEntityID;
  playerId: UniqueEntityID;
  masterActionId?: UniqueEntityID;
  action: ACTION;
  actionDescription: ActionDescription;
  actionResult?: ActionResult;
  createdAt?: Date;
  updatedAt?: Date;
  chainedActions?: TurnHistoryProps[];
}

export class TurnHistory extends Entity<TurnHistoryProps> {
  get playerId() {
    return this.props.playerId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get masterActionId () {
    return this.props.masterActionId;
  }
  get turnId() {
    return this.props.turnId;
  }

  get action() {
    return this.props.action;
  }

  get actionDescription() {
    return this.props.actionDescription;
  }

  get actionResult() {
    return this.props.actionResult;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: TurnHistoryProps, id?: UniqueEntityID) {
    if (!props.createdAt) {
      props.createdAt = new Date();
    }
    const turnHistory = new TurnHistory(props, id);

    return turnHistory;
  }
}
