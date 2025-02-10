import { Match, MatchProps } from '@/domain/matches/enterprise/entities/Match';
import { UniqueEntityID } from 'src/core/entities/unique_entity_id';

export function makeMatch(
  override: Partial<MatchProps> = {},
  id?: UniqueEntityID,
) {
  const match = Match.create(
    {
      ...override,
    },
    id,
  );

  return match;
}
