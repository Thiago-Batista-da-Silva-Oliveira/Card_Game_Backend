/* eslint-disable @typescript-eslint/require-await */
import { MatchRepository } from '../IMatchRepository';
import { Match } from '@/domain/matches/enterprise/entities/Match';

export class InMemoryMatchRepository implements MatchRepository {
  public items: Match[] = [];

  async create(match: Match): Promise<Match> {
    this.items.push(match);
    return match;
  }
}
