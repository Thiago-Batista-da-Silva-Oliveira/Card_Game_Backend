import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export interface PlayersInMatchProps {
  matchId: UniqueEntityID;
  playerId: UniqueEntityID;
}

export class PlayersInMatch extends Entity<PlayersInMatchProps> {
  get playerId() {
    return this.props.playerId;
  }
  get matchId() {
    return this.props.matchId;
  }

  static create(props: PlayersInMatchProps, id?: UniqueEntityID) {
    const playersInMatch = new PlayersInMatch(props, id);

    return playersInMatch;
  }
}
