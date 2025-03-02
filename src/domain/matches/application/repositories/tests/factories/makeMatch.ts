import { Match, MatchProps } from '@/domain/matches/enterprise/entities/Match';
import { TurnWatchedList } from '@/domain/matches/enterprise/entities/TurnList';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export function makeMatch(
  override: Partial<MatchProps> = {},
  id?: UniqueEntityID,
) {
  const match = Match.create(
    {
      currentTurn: 1,
      turns: new TurnWatchedList(),
      ...override,
    },
    id,
  );

  return match;
}
