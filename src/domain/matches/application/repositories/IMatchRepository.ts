import { Match } from '../../enterprise/entities/Match';

export abstract class MatchRepository {
  abstract create(match: Match): Promise<Match>;
}
