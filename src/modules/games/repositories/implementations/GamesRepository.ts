import { createQueryBuilder, getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(title: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games')
      .where('LOWER(games.title) like LOWER(:title)', { title: `%${title}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('select count(*) as count from games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder('games')
      .relation(Game, 'users')
      .of(id)
      .loadMany()
  }
}