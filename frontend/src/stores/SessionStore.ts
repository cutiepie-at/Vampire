import {Pinia, Store} from 'pinia-class-component';
import type {UserInfo, UserSessionInfo} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';

@Store({
  id: 'SessionStore',
  name: 'SessionStore',
})
export class SessionStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _user: UserInfo | null = null;
  private _session: UserSessionInfo | null = null;

  //getter
  get isLoggedIn(): boolean {
    return !!this.user;
  }

  get user(): UserInfo | null {
    return this._user;
  }

  get session(): UserSessionInfo | null {
    return this._session;
  }

  //actions
  clear() {
    this._user = null;
    this._session = null;
  }

  setSession(user: UserInfo, session: UserSessionInfo) {
    this._user = user;
    this._session = session;
  }

  async reload() {
    try {
      const res = await this.apiStore.authApi.apiV1AuthVerifyPost();
      this._user = res.user ?? null;
      this._session = res.session ?? null;
    } catch (err) {
      this.clear();
    }
  }
}