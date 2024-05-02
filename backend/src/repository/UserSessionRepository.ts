import UserSession from '../models/db/UserSession';
import {UniqueViolationError} from 'db-errors';
import type {TransactionOrKnex} from 'objection';

export default class UserSessionRepository {
  async getAll(trx?: TransactionOrKnex): Promise<UserSession[]> {
    return UserSession.query(trx);
  }

  async getById(id: string, trx?: TransactionOrKnex): Promise<UserSession | undefined> {
    return UserSession.query(trx).findById(id);
  }

  async getByUserId(userId: string, trx?: TransactionOrKnex): Promise<UserSession[]> {
    return UserSession.query(trx).where('userId', userId);
  }

  async getByToken(token: string, trx?: TransactionOrKnex): Promise<UserSession | undefined> {
    return UserSession.query(trx).where('token', token).first();
  }

  async add(userSession: UserSession, trx?: TransactionOrKnex): Promise<UserSession> {
    return UserSession.query(trx).insert(userSession);
  }

  async addIgnoreDuplicate(userSession: UserSession, trx?: TransactionOrKnex): Promise<UserSession> {
    try {
      return await this.add(userSession, trx);
    } catch (err) {
      if (err instanceof UniqueViolationError) {//suppress duplicate session id error
        return userSession;
      }
      throw err;
    }
  }

  async update(userSession: UserSession, trx?: TransactionOrKnex): Promise<boolean> {
    return await UserSession.query(trx).findById(userSession.id).update(userSession) === 1;
  }

  async remove(id: string, trx?: TransactionOrKnex): Promise<boolean> {
    return await UserSession.query(trx).findById(id).delete() === 1;
  }

  async removeIfPresent(id: string, trx?: TransactionOrKnex): Promise<void> {
    await this.remove(id, trx);
  }

  async count(trx?: TransactionOrKnex): Promise<number> {
    return await UserSession.query(trx).resultSize();
  }

  async truncate(trx?: TransactionOrKnex): Promise<void> {
    return await UserSession.query(trx).truncate();
  }
} 

