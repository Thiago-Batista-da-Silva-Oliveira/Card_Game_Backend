import { UniqueEntityID } from '@/core/entities/unique_entity_id';

export interface ICreateMatchDTO {
  status?: 'finished' | 'open';
  playersInMatchProps: {
    matchId: UniqueEntityID;
    playerId: UniqueEntityID;
  }[];
}
