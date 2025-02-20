import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';
import { CurrentCardStateWatchedList } from './CurrentCardStateList';

export interface PlayersInMatchProps {
  matchId: UniqueEntityID;
  playerId: UniqueEntityID;
  life?: number;
  remainingCardsInDeck?: number;
  currentCardsState?: CurrentCardStateWatchedList;
}

export class PlayersInMatch extends Entity<PlayersInMatchProps> {
  get playerId() {
    return this.props.playerId;
  }

  get matchId() {
    return this.props.matchId;
  }

  get life() {
    return this.props.life;
  }

  get remainingCardsInDeck() {
    return this.props.remainingCardsInDeck;
  }

  get currentCardsState() {
    return this.props.currentCardsState;
  }

  set currentCardsState(currentCardsState) {
    this.props.currentCardsState = currentCardsState;
  }

  static create(props: PlayersInMatchProps, id?: UniqueEntityID) {
    if (!props.life) {
      props.life = 30;
    }

    if (!props.remainingCardsInDeck) {
      props.remainingCardsInDeck = 30;
    }

    const playersInMatch = new PlayersInMatch(props, id);

    return playersInMatch;
  }
}
