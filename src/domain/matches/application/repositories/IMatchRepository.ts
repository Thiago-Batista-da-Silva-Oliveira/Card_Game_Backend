import { Match } from '../../enterprise/entities/Match';

export abstract class MatchRepository {
  abstract create(match: Match): Promise<Match>;
  abstract findById(matchId: string): Promise<Match | null>;
  abstract save(match: Match): Promise<Match>;
}
