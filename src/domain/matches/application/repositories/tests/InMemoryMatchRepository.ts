/* eslint-disable @typescript-eslint/require-await */
import { MatchRepository } from '../IMatchRepository';
import { Match } from '@/domain/matches/enterprise/entities/Match';

export class InMemoryMatchRepository implements MatchRepository {
  public items: Match[] = [];

  async create(match: Match): Promise<Match> {
    this.items.push(match);
    return match;
  }

  async findById(matchId: string): Promise<Match | null> {
    const match = this.items.find((match) => match.id.toValue() === matchId);

    return match || null;
  }

  async save(match: Match): Promise<Match> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === match.id.toValue(),
    );

    this.items[itemIndex] = match;

    return this.items[itemIndex];
  }

  async findOpenMatchByPlayerId(playerId: string): Promise<Match | null> {
    const match = this.items.find(
      (data) =>
        data.status === 'open' &&
        data.playersInMatch
          ?.getItems()
          ?.map((player) => player.playerId.toValue())
          .includes(playerId),
    );

    return match || null;
  }
}
